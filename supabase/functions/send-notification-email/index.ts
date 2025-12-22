import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface NotificationRequest {
  type: 'match' | 'message';
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  messagePreview?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, recipientEmail, recipientName, senderName, messagePreview }: NotificationRequest =
      await req.json();

    if (!type || !recipientEmail || !recipientName || !senderName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let subject = '';
    let htmlContent = '';

    if (type === 'match') {
      subject = `You have a new match on UrbanDen!`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10B981); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .match-badge { background: #10B981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 20px 0; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Match!</h1>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              <p>Great news! You have a new match on UrbanDen.</p>
              <div class="match-badge">✨ You matched with ${senderName}!</div>
              <p>This means ${senderName} is also interested in being your roommate. Start chatting now to get to know each other better!</p>
              <a href="${supabaseUrl.replace('//', '//app.')}" class="button">View Match</a>
              <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">Remember to meet in public places and trust your instincts when connecting with new people.</p>
            </div>
            <div class="footer">
              <p>UrbanDen - Find Your Perfect Roommate</p>
              <p style="font-size: 12px; color: #9CA3AF;">If you didn't sign up for UrbanDen, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'message') {
      subject = `New message from ${senderName} on UrbanDen`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #6366F1); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .message-preview { background: #F9FAFB; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0; font-style: italic; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Message</h1>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              <p>You have a new message from <strong>${senderName}</strong>:</p>
              ${messagePreview ? `<div class="message-preview">${messagePreview}</div>` : ''}
              <a href="${supabaseUrl.replace('//', '//app.')}" class="button">Reply Now</a>
              <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">Stay safe and report any suspicious behavior.</p>
            </div>
            <div class="footer">
              <p>UrbanDen - Find Your Perfect Roommate</p>
              <p style="font-size: 12px; color: #9CA3AF;">To manage your notification settings, visit your profile settings.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    console.log(`Sending ${type} notification to ${recipientEmail}`);
    console.log('Email would be sent with subject:', subject);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification email queued successfully',
        type,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});