import { supabase } from './supabase';

export interface ChecklistTemplate {
  id: string;
  title: string;
  description: string;
  category: 'move-in' | 'safety' | 'compatibility' | 'pre-meeting';
  icon: string;
  order_index: number;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  template_id: string;
  title: string;
  description: string | null;
  order_index: number;
  input_type: 'checkbox' | 'dropdown' | 'text' | 'date';
  dropdown_options: string[] | null;
  created_at: string;
}

export interface UserChecklistProgress {
  id: string;
  user_id: string;
  item_id: string;
  is_completed: boolean;
  selected_value: string | null;
  notes: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface ChecklistItemWithProgress extends ChecklistItem {
  progress?: UserChecklistProgress;
}

export interface ChecklistTemplateWithItems extends ChecklistTemplate {
  items: ChecklistItemWithProgress[];
  completedCount: number;
  totalCount: number;
}

export async function getChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*')
    .order('order_index');

  if (error) {
    console.error('Error fetching checklist templates:', error);
    throw error;
  }

  return data || [];
}

export async function getChecklistWithItems(
  templateId: string,
  userId: string
): Promise<ChecklistTemplateWithItems | null> {
  const { data: template, error: templateError } = await supabase
    .from('checklist_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle();

  if (templateError || !template) {
    console.error('Error fetching template:', templateError);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('template_id', templateId)
    .order('order_index');

  if (itemsError) {
    console.error('Error fetching items:', itemsError);
    return null;
  }

  const { data: progress, error: progressError } = await supabase
    .from('user_checklist_progress')
    .select('*')
    .eq('user_id', userId)
    .in(
      'item_id',
      items?.map((i) => i.id) || []
    );

  if (progressError) {
    console.error('Error fetching progress:', progressError);
  }

  const progressMap = new Map(progress?.map((p) => [p.item_id, p]) || []);

  const itemsWithProgress: ChecklistItemWithProgress[] = (items || []).map((item) => ({
    ...item,
    progress: progressMap.get(item.id),
  }));

  const completedCount = itemsWithProgress.filter(
    (item) => item.progress?.is_completed
  ).length;

  return {
    ...template,
    items: itemsWithProgress,
    completedCount,
    totalCount: itemsWithProgress.length,
  };
}

export async function updateChecklistProgress(
  userId: string,
  itemId: string,
  isCompleted: boolean,
  selectedValue?: string,
  notes?: string
): Promise<void> {
  const updateData: any = {
    user_id: userId,
    item_id: itemId,
    is_completed: isCompleted,
    updated_at: new Date().toISOString(),
  };

  if (selectedValue !== undefined) {
    updateData.selected_value = selectedValue;
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  if (isCompleted) {
    updateData.completed_at = new Date().toISOString();
  } else {
    updateData.completed_at = null;
  }

  const { error } = await supabase
    .from('user_checklist_progress')
    .upsert(updateData, {
      onConflict: 'user_id,item_id',
    });

  if (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
}

export async function getUserChecklistStats(userId: string): Promise<{
  totalChecklists: number;
  completedChecklists: number;
  totalItems: number;
  completedItems: number;
}> {
  const { data: templates } = await supabase
    .from('checklist_templates')
    .select('id');

  const { data: allItems } = await supabase
    .from('checklist_items')
    .select('id, template_id');

  const { data: progress } = await supabase
    .from('user_checklist_progress')
    .select('item_id, is_completed, template_id:checklist_items(template_id)')
    .eq('user_id', userId)
    .eq('is_completed', true);

  const totalItems = allItems?.length || 0;
  const completedItems = progress?.length || 0;

  const completedByTemplate = new Map<string, Set<string>>();
  const itemsByTemplate = new Map<string, Set<string>>();

  allItems?.forEach((item) => {
    if (!itemsByTemplate.has(item.template_id)) {
      itemsByTemplate.set(item.template_id, new Set());
    }
    itemsByTemplate.get(item.template_id)!.add(item.id);
  });

  progress?.forEach((p: any) => {
    const templateId = p.template_id?.template_id;
    if (templateId) {
      if (!completedByTemplate.has(templateId)) {
        completedByTemplate.set(templateId, new Set());
      }
      completedByTemplate.get(templateId)!.add(p.item_id);
    }
  });

  let completedChecklists = 0;
  itemsByTemplate.forEach((items, templateId) => {
    const completed = completedByTemplate.get(templateId);
    if (completed && completed.size === items.size) {
      completedChecklists++;
    }
  });

  return {
    totalChecklists: templates?.length || 0,
    completedChecklists,
    totalItems,
    completedItems,
  };
}
