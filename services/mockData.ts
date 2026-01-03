import { User, RoommateAgreement } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user_mock_1',
    firstName: 'Emma',
    age: 26,
    gender: 'female',
    occupation: 'Marketing Manager',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Love the outdoors, always up for a hike or weekend trip. Looking for a clean, social roommate who respects personal space. I work from home occasionally, so a quiet environment during the day is appreciated!',
    email: 'emma.wilson@example.com',
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
    photos: [],
    preferences: {
      genderPreference: 'any',
      budgetMin: 1200,
      budgetMax: 1800,
      location: {
        state: 'NY',
        city: 'New York City',
        neighborhood: 'Brooklyn - Williamsburg',
      },
      moveInDate: 'flexible',
      petPreference: 'love-pets',
      smokingPreference: 'non-smoker',
      drinkingPreference: 'social-drinker',
      cleanliness: 'very-clean',
      socialLevel: 'sometimes',
    },
  },
  {
    id: 'user_mock_2',
    firstName: 'Sarah',
    age: 24,
    gender: 'female',
    occupation: 'Software Developer',
    profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Tech enthusiast and coffee addict. I spend most of my time coding or exploring new cafes. Looking for a quiet, responsible roommate. I value my privacy but enjoy occasional movie nights!',
    email: 'sarah.chen@example.com',
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-02-10'),
    lastActive: new Date(),
    photos: [],
    preferences: {
      genderPreference: 'female',
      budgetMin: 1000,
      budgetMax: 1500,
      location: {
        state: 'CA',
        city: 'San Francisco',
        neighborhood: 'Mission District',
      },
      moveInDate: '2-3months',
      petPreference: 'no-pets',
      smokingPreference: 'non-smoker',
      drinkingPreference: 'non-drinker',
      cleanliness: 'clean',
      socialLevel: 'quiet',
    },
  },
  {
    id: 'user_mock_3',
    firstName: 'Alex',
    age: 28,
    gender: 'male',
    occupation: 'Graphic Designer',
    profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Creative soul with a passion for art and music. I play guitar and love hosting small gatherings. Looking for a roommate who enjoys good vibes and doesn\'t mind occasional jam sessions!',
    email: 'alex.johnson@example.com',
    isVerified: false,
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: new Date('2024-03-05'),
    lastActive: new Date(),
    photos: [],
    preferences: {
      genderPreference: 'any',
      budgetMin: 800,
      budgetMax: 1400,
      location: {
        state: 'CA',
        city: 'Los Angeles',
        neighborhood: 'Silver Lake',
      },
      moveInDate: 'urgent',
      petPreference: 'flexible',
      smokingPreference: 'non-smoker',
      drinkingPreference: 'social-drinker',
      cleanliness: 'flexible',
      socialLevel: 'very-social',
    },
  },
  {
    id: 'user_mock_4',
    firstName: 'Jordan',
    age: 25,
    gender: 'non-binary',
    occupation: 'Teacher',
    profilePicture: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Elementary school teacher who loves reading and yoga. My cat Luna is my best friend! Looking for a clean, pet-friendly roommate who values a peaceful home environment.',
    email: 'jordan.taylor@example.com',
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-20'),
    lastActive: new Date(),
    photos: [],
    preferences: {
      genderPreference: 'any',
      budgetMin: 900,
      budgetMax: 1300,
      location: {
        state: 'TX',
        city: 'Austin',
        neighborhood: 'East Austin',
      },
      moveInDate: 'flexible',
      petPreference: 'love-pets',
      smokingPreference: 'non-smoker',
      drinkingPreference: 'non-drinker',
      cleanliness: 'very-clean',
      socialLevel: 'sometimes',
    },
  },
];

export const agreementTemplates: RoommateAgreement[] = [
  {
    id: 'template_1',
    title: 'Basic Roommate Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Basic Roommate Agreement

This agreement is entered into on [Date] between the following roommates:

**Roommate 1:** [Name]
**Roommate 2:** [Name]

## 1. Rent and Utilities

- Total monthly rent: $[Amount]
- Roommate 1 pays: $[Amount]
- Roommate 2 pays: $[Amount]
- Due date: [Day] of each month
- Utilities split: [Percentage] / [Percentage]

## 2. House Rules

- Quiet hours: [Time] to [Time]
- Guests: [Policy on overnight guests]
- Cleaning schedule: [Details]
- Shared spaces: [Kitchen, living room policies]

## 3. Personal Property

- All personal items remain the property of the individual
- Shared items purchased together will be [equally owned/designated owner]

## 4. Communication

- House meetings: [Frequency]
- Issues will be addressed within [timeframe]

## 5. Signatures

**Roommate 1:** _________________ Date: _______
**Roommate 2:** _________________ Date: _______`,
  },
  {
    id: 'template_3',
    title: 'College Student Roommate Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# College Student Roommate Agreement

Date: [Date]
Academic Year: [Year]

**Roommate 1:** [Name] - Major: [Major]
**Roommate 2:** [Name] - Major: [Major]

**Residence:** [Dorm/Apartment Name and Number]

## 1. Financial Arrangements

- Monthly rent per person: $[Amount]
- Security deposit per person: $[Amount]
- Utilities (if applicable): Split 50/50
- Internet/streaming: [Who pays or split]
- Payment method: [Venmo, Zelle, etc.]
- Due date: [Day] of month

## 2. Study & Sleep Schedule

### Study Times
- Quiet study hours: [Weekday times]
- Library study preference: [When to use library vs. room]
- Study music/noise: [Headphones required]

### Sleep Schedule
- Lights out on weeknights: [Time]
- Lights out on weekends: [Time]
- Early morning classes: [Courtesy measures]
- Late night cramming: [Guest room or alternative space]

## 3. Room Arrangement

- Bed placement: [Description]
- Desk areas: [Who gets which]
- Closet/storage: [Division]
- Decorating: [Mutual agreement required]
- Temperature control: [Agreed setting]

## 4. Guests & Social Life

- Overnight guests: [How many nights per week maximum]
- Advance notice: [How much]
- Romantic partners: [Courtesy signal system]
- Study groups: [Location, time limits]
- Parties: [Must be elsewhere or get roommate approval]

## 5. Cleanliness & Organization

- Trash: Take out weekly by [who/rotation]
- Dishes: Clean within [timeframe]
- Laundry: [Schedule to avoid conflicts]
- Vacuuming: [Frequency and responsibility]
- Personal items: Keep in designated areas

## 6. Food & Kitchen Use

- Groceries: [Separate or shared]
- Labeling system: [Name on items]
- Borrowing food: [Ask first policy]
- Kitchen appliances: [Sharing policy]
- Mini-fridge space: [Division]

## 7. Technology & Privacy

- WiFi password: [Shared]
- TV/gaming time: [Fair use policy]
- Phone calls: [Take in hallway if roommate studying]
- Social media: [Respect privacy, ask before posting]
- Device charging: [Outlet arrangements]

## 8. Substance Use

- Alcohol: [Policy following dorm/apartment rules]
- Smoking/vaping: [Not allowed in room]
- Other substances: [Follow school and legal policies]

## 9. Breaks & Vacations

- Winter break plans: [Who stays, who leaves]
- Spring break plans: [Details]
- Summer plans: [Subletting policy if applicable]
- Mail/package handling: [During absences]

## 10. Conflict Resolution

- Talk it out first
- If unresolved: [RA/mediator involvement]
- Regular check-ins: [Weekly or bi-weekly]
- Roommate meetings: [As needed]

## 11. Emergency Information

**Roommate 1:**
- Cell phone: [Number]
- Parent/emergency contact: [Name & Number]
- Hometown: [City, State]

**Roommate 2:**
- Cell phone: [Number]
- Parent/emergency contact: [Name & Number]
- Hometown: [City, State]

## Agreement

We agree to respect each other's space, time, and property. We commit to open communication and will address issues promptly and respectfully.

**Roommate 1:** _________________ Date: _______
**Roommate 2:** _________________ Date: _______`,
  },
  {
    id: 'template_4',
    title: 'Pet-Friendly Living Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Pet-Friendly Roommate Agreement

This pet-inclusive agreement is made on [Date] between:

**Roommate 1:** [Name]
**Roommate 2:** [Name]

**Address:** [Full Address]
**Lease Term:** [Start Date] to [End Date]

## 1. Pet Information

### Current Pets
**Roommate 1's Pet(s):**
- Name: [Name]
- Type/Breed: [Type]
- Age: [Age]
- Weight: [Weight]
- Vaccinations current: [Yes/No]
- Spayed/Neutered: [Yes/No]

**Roommate 2's Pet(s):**
- Name: [Name]
- Type/Breed: [Type]
- Age: [Age]
- Weight: [Weight]
- Vaccinations current: [Yes/No]
- Spayed/Neutered: [Yes/No]

### Future Pets
- Additional pets: [Require mutual agreement]
- Temporary pet sitting: [Advance notice required]
- Pet allergies: [Disclose any]

## 2. Financial Responsibilities

### Pet Deposits & Fees
- Pet deposit: $[Amount per pet]
- Monthly pet rent: $[Amount per pet]
- Who pays: [Each owner pays for their pet]

### Shared Costs (if applicable)
- Cleaning supplies for pet areas: [Split or owner pays]
- Air filters (due to pet dander): [How split]
- Carpet cleaning (move-out): [How split]

### Damage Costs
- Pet owner is 100% responsible for damage caused by their pet
- This includes furniture, walls, floors, doors
- Deep cleaning costs if needed

## 3. Pet Care Responsibilities

### Daily Care
- Feeding: [Owner responsible]
- Walking: [Owner responsible - times per day]
- Litter box: [Clean daily by owner]
- Accidents: [Clean immediately by owner]

### Veterinary Care
- Regular vet visits: [Owner's responsibility]
- Emergency vet expenses: [Owner pays]
- Flea/tick prevention: [Owner maintains]
- Required vaccinations: [Owner ensures current]

### Grooming
- Regular grooming: [Owner's responsibility]
- Bathing: [Frequency and location]
- Nail trimming: [Owner arranges]
- Shedding control: [Brushing frequency]

## 4. House Rules for Pets

### Boundaries
- Bedrooms: [Pet allowed in owner's room only / all rooms OK]
- Furniture: [Pets allowed on couch/beds or not]
- Kitchen counters: [Never allowed]
- Bathroom: [Policy]

### Noise Control
- Barking/meowing: [Owner must address excessive noise]
- Quiet hours: [Pets must be calm during: Time to Time]
- Training: [Owner commits to training to minimize disturbances]

### Cleanliness
- Pet hair: [Vacuum/sweep frequency]
- Odor control: [Air fresheners, cleaning schedule]
- Litter box location: [Designated spot, must be covered]
- Food/water bowls: [Designated location, keep area clean]
- Pet toys: [Keep in designated areas]

## 5. Guest & Visitor Policies

### Human Guests
- Inform guests about pets: [In advance]
- Secure pets if guests uncomfortable: [In bedroom]
- Guest allergies: [Accommodate as needed]

### Pet Guests
- Other pets visiting: [Advance approval required]
- Introduction period: [Supervised meetings]
- Duration limit: [Maximum days]

## 6. Outdoor Spaces

### Balcony/Patio (if applicable)
- Pet access: [Supervised only / allowed unsupervised]
- Waste cleanup: [Immediate]
- Noise considerations: [Control barking outside]

### Yard (if applicable)
- Waste pickup: [Owner picks up immediately]
- Leash requirements: [If shared yard]
- Designated pet area: [If applicable]

## 7. Time Away & Pet Sitting

### Short Absences (1-3 days)
- Overnight absences: [Arrange pet care]
- Pet sitting: [Roommate willing/not willing to help]
- Compensation if roommate helps: $[Amount per day] or [trade pet sitting]

### Extended Absences (4+ days)
- Pet care arrangements: [Professional sitter or boarding]
- Cannot leave pet with roommate without agreement
- Emergency contact: [Provide vet info and care instructions]

## 8. Safety & Security

### Preventive Measures
- Doors/windows: [Always secure to prevent pet escape]
- Toxic substances: [Store safely - cleaning products, plants, foods]
- Small items: [Keep off floor - choking hazards]
- Emergency plan: [Pet evacuation plan]

### Emergency Contacts
**Roommate 1's Pet:**
- Primary vet: [Name, Phone, Address]
- Emergency vet: [Name, Phone, Address]
- Alternative caretaker: [Name, Phone]

**Roommate 2's Pet:**
- Primary vet: [Name, Phone, Address]
- Emergency vet: [Name, Phone, Address]
- Alternative caretaker: [Name, Phone]

## 9. Behavior Issues

### Problem Behaviors
- Aggression: [Zero tolerance - requires immediate action]
- Destruction: [Owner must address and pay for damages]
- Excessive noise: [Training or solutions required within timeframe]
- House training issues: [Timeframe to resolve]

### Resolution Steps
1. Owner addresses behavior: [Within 2 weeks]
2. Professional help: [Trainer or vet behaviorist if needed]
3. Last resort: [Rehoming if behavior cannot be resolved]

## 10. Moving Out

### Notice Period
- Standard notice: [30/60 days]
- Pet factors: [New home must accept pets]

### Final Cleaning
- Deep clean all pet areas
- Professional carpet cleaning: [Required if pets]
- Repair any pet damage
- Remove all pet supplies and belongings

### Deposit Return
- Pet deposit: [Returned minus damages]
- Damage assessment: [Based on move-in condition]

## Agreement

We agree to be responsible pet owners and considerate roommates. We will maintain a clean, safe, and harmonious home for both humans and pets.

**Roommate 1:** _________________
Pet Owner: [Yes/No]
Date: _______

**Roommate 2:** _________________
Pet Owner: [Yes/No]
Date: _______`,
  },
  {
    id: 'template_5',
    title: 'Work-From-Home Roommate Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Work-From-Home Roommate Agreement

Date: [Date]

**Roommate 1:** [Name] - Occupation: [Job Title]
**Roommate 2:** [Name] - Occupation: [Job Title]

**Address:** [Full Address]

## 1. Work Schedules

### Roommate 1
- Work days: [Days of week]
- Work hours: [Start time] to [End time]
- Work location: [Home office, bedroom, etc.]
- Typical meeting times: [When most calls occur]
- Flexible/Fixed schedule: [Type]

### Roommate 2
- Work days: [Days of week]
- Work hours: [Start time] to [End time]
- Work location: [Home office, bedroom, etc.]
- Typical meeting times: [When most calls occur]
- Flexible/Fixed schedule: [Type]

## 2. Workspace Arrangements

### Designated Work Areas
**Roommate 1:** [Specific room/area]
- Dedicated office: [Yes/No]
- Shared space accommodations: [Details]
- Storage for work materials: [Where]

**Roommate 2:** [Specific room/area]
- Dedicated office: [Yes/No]
- Shared space accommodations: [Details]
- Storage for work materials: [Where]

### Equipment & Furniture
- Desks: [Who owns what]
- Chairs: [Who owns what]
- Monitors/tech: [Personal ownership]
- Office supplies: [Personal or shared]
- Shared equipment use: [Printer, etc. - policy]

## 3. Noise Management

### During Work Hours
- Noise level expectations: [Library quiet, reasonable, etc.]
- Music/TV: [Use headphones during work hours]
- Phone conversations: [Keep voice down]
- Kitchen use: [Quiet as possible]
- Cleaning/chores: [Avoid noisy tasks during meetings]

### Virtual Meetings
- Background noise control: [Close doors, mute TV]
- Visual backgrounds: [Keep shared spaces tidy if visible]
- Advance notice: [Text when starting important calls]
- Meeting signal: [Door closed = in meeting]
- Walking past camera: [Avoid if possible, or crouch]

### Breaks Between Work Spaces
- Sound insulation: [Rugs, door draft stoppers if needed]
- White noise machines: [If needed, who buys]
- Headphone recommendations: [Noise cancelling options]

## 4. Internet & Technology

### Internet Service
- Internet plan: [Speed, provider]
- Cost split: [How divided]
- Bandwidth priority: [During work hours, both equal priority]
- Upgrade needs: [Who pays if upgrade needed]

### WiFi Management
- Router location: [Central location for coverage]
- Network name & password: [Shared information]
- Guest network: [For visitors to avoid slowing main network]
- Tech issues: [Both responsible for troubleshooting]

### Internet Quality During Work
- Bandwidth for work: [Priority during business hours]
- Large downloads: [Schedule outside work hours]
- Gaming/streaming: [Limit during work hours if affecting internet]

## 5. Shared Spaces During Work

### Kitchen Access
- Coffee/snacks: [Accessible anytime, quietly]
- Lunch prep: [Keep noise minimal]
- Meal timing: [Coordinate to avoid conflicts]
- Dishes: [Clean immediately if working from kitchen]

### Living Room/Common Areas
- Working from shared spaces: [Coordination required]
- Shared area appearance: [Keep areas presentable during work hours]
- Personal items: [Clear away after work]
- TV/entertainment: [Not during work hours unless agreed]

### Bathroom Use
- Morning routine: [Coordinate schedules]
- Quick access needed: [Respect urgent needs]
- Cleaning: [Maintain throughout day]

## 6. Boundaries & Privacy

### Work Hours Boundaries
- Interruptions: [Avoid unless urgent]
- Questions/conversations: [Wait for breaks or end of day]
- Lunch/break times: [When it's OK to chat]
- End of workday: [Transition time respected]

### Privacy & Confidentiality
- Confidential calls: [Respect closed doors]
- Work documents: [Don't read/share]
- Client/coworker info: [Keep private]
- Screen privacy: [Don't view others' screens]

### After Work Hours
- Decompression time: [Allow transition from work mode]
- Work talk: [Limit if stressed]
- Socializing: [Resume normal roommate interaction]

## 7. Utilities & Costs

### Increased Usage
- Electricity: [Increased use due to home work]
- Heating/AC: [Running during day]
- Water: [Bathroom breaks, coffee]
- Split: [Remains 50/50 or adjusted]

### Work-Related Expenses
- Internet: [Split evenly as both need]
- Printer paper/ink: [Each person's own]
- Office supplies: [Personal responsibility]
- Coffee/snacks: [Personal groceries]

## 8. Visitors & Deliveries

### Work Visitors
- Client meetings at home: [Advance notice required]
- Professional cleaners: [Inform roommate]
- IT/tech support: [Schedule appropriately]
- Coworkers: [Treat as regular guests]

### Package Deliveries
- Work packages: [Frequent - don't block entryway]
- Signature required: [Try to be available or coordinate]
- Package notifications: [Text when package arrives]
- Storage: [Personal packages in own space ASAP]

## 9. Mental Health & Work-Life Balance

### Respecting Boundaries
- Work mode vs. off mode: [Recognize and respect]
- Bad work day: [Give space if needed]
- Stress management: [Support each other]
- Breaks together: [Optional, not required]

### Social Balance
- Lunch together: [Optional, coordinate if desired]
- Coffee breaks: [OK to chat during]
- After work hangout: [Separate work and home life]
- Weekend boundaries: [No work talk unless asked]

## 10. Cleanliness During Work Hours

### Daily Maintenance
- Keep work areas organized: [Daily tidy]
- Common area tidiness: [Clean as you go]
- Dishes: [Wash after meals]
- Trash: [Don't let accumulate]

### Professional Appearance
- Work areas: [Keep visible areas neat and professional]
- Personal hygiene: [Professional even at home]
- Casual dress: [OK, but presentable]

## 11. Flexibility & Communication

### Schedule Changes
- Notify roommate: [If schedule changes significantly]
- Temporary changes: [Extra meetings, early calls]
- New projects: [If affecting household more]

### Regular Check-ins
- Weekly sync: [Discuss upcoming week's schedules]
- Monthly review: [Assess if arrangement working]
- Adjust as needed: [Flexible with each other]

### Problem Resolution
- Address issues promptly: [Don't let resentment build]
- Suggest solutions: [Work together]
- Trial periods: [Test changes before committing]

## 12. Emergency Situations

### Work Emergencies
- Major deadlines: [May need extra quiet/space]
- System failures: [Support each other]
- Unexpected calls: [Accommodate when possible]

### Household Emergencies
- Maintenance issues: [Work schedule may need adjustment]
- Personal emergencies: [Support and flexibility]
- Health issues: [Accommodate sick roommate]

## Agreement

We commit to creating a productive work environment while maintaining a comfortable home. We will communicate openly about our needs and show flexibility and respect for each other's professional responsibilities.

**Roommate 1:** _________________
Date: _______

**Roommate 2:** _________________
Date: _______`,
  },
  {
    id: 'template_2',
    title: 'Detailed Living Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Comprehensive Roommate Agreement

This detailed agreement is made on [Date] between:

**Roommate 1:** [Full Name]
**Roommate 2:** [Full Name]

For the property located at: [Address]

## 1. Property Information

- Lease term: [Start Date] to [End Date]
- Landlord contact: [Name, Phone, Email]
- Emergency maintenance: [Contact info]

## 2. Financial Responsibilities

### Rent
- Total monthly rent: $[Amount]
- Roommate 1's share: $[Amount] ([Percentage]%)
- Roommate 2's share: $[Amount] ([Percentage]%)
- Payment method: [Check, transfer, etc.]
- Due date: [Day] of each month
- Late payment policy: [Details]

### Utilities
- Electric: Split [Percentage] / [Percentage]
- Gas: Split [Percentage] / [Percentage]
- Water: Split [Percentage] / [Percentage]
- Internet: Split [Percentage] / [Percentage]
- Streaming services: [Who pays, how split]

### Security Deposit
- Total deposit: $[Amount]
- Roommate 1 paid: $[Amount]
- Roommate 2 paid: $[Amount]
- Return conditions: [Details]

## 3. Household Responsibilities

### Cleaning Schedule
- Kitchen: [Who, when]
- Bathrooms: [Who, when]
- Living room: [Who, when]
- Trash/recycling: [Who, when]
- Deep cleaning: [Frequency, responsibility]

### Supplies
- Cleaning supplies: [Who buys, how often]
- Paper products: [Who buys, how often]
- Shared groceries: [Policy]

## 4. House Rules and Lifestyle

### Quiet Hours
- Weekdays: [Time] to [Time]
- Weekends: [Time] to [Time]
- Special considerations: [Details]

### Guests
- Overnight guests: [Policy, advance notice required]
- Maximum consecutive nights: [Number]
- Guest bathroom use: [Policy]
- Keys for guests: [Policy]

### Parties/Gatherings
- Advance notice: [How much]
- Maximum frequency: [Details]
- Cleanup responsibility: [Host cleans]
- Noise considerations: [Details]

## 5. Pets

- Pets allowed: [Yes/No]
- Current pets: [List]
- Pet responsibilities: [Owner handles all care, cleaning]
- Pet deposit: [Amount, who pays]
- Damage policy: [Owner responsible]

## 6. Substances

### Smoking
- Smoking allowed: [Yes/No/Where]
- Vaping policy: [Details]
- Marijuana: [Policy, considering local laws]

### Alcohol
- Storage: [Where]
- Parties: [Policy]
- Shared vs. personal: [Labeling system]

## 7. Personal Property

### Shared Items
- Furniture: [List with ownership]
- Kitchen items: [List with ownership]
- Electronics: [List with ownership]
- Upon move-out: [How items are divided]

### Personal Items
- Respect for personal property
- Borrowing policy: [Ask first, etc.]
- Personal space boundaries: [Bedrooms are private]

## 8. Communication

### Regular Check-ins
- House meetings: [Monthly/as needed]
- Issues addressed within: [24-48 hours]
- Communication method: [Text, in-person, etc.]

### Conflict Resolution
- Discussion first
- Mediation if needed: [Neutral third party]
- Last resort: [Landlord involvement]

## 9. Moving Out

### Notice Period
- Advance notice required: [30/60 days]
- Notice must be: [Written]
- Finding replacement: [Responsibility, approval process]

### Cleaning
- Unit must be cleaned: [To original condition]
- Professional cleaning: [If required, cost split]
- Final walkthrough: [Together with landlord]

### Final Costs
- Last month's utilities: [Split based on move-out dates]
- Repairs: [Responsible party pays]
- Deposit return: [Split according to initial payment]

## 10. Emergency Procedures

### Emergency Contacts
- Roommate 1: [Phone]
- Roommate 2: [Phone]
- Emergency contact for Roommate 1: [Name, Phone]
- Emergency contact for Roommate 2: [Name, Phone]

### Building Emergencies
- Fire: [Exit plan, meeting spot]
- Flood: [Water shutoff location]
- Power outage: [Breaker location, flashlight location]
- Lock-out: [Spare key location or plan]

## Agreement

We, the undersigned, agree to the terms outlined in this roommate agreement. We understand that this is a binding agreement and commit to honoring these terms for the duration of our cohabitation.

**Roommate 1:**
Signature: _________________
Print Name: _________________
Date: _______

**Roommate 2:**
Signature: _________________
Print Name: _________________
Date: _______

**Witness (Optional):**
Signature: _________________
Print Name: _________________
Date: _______`,
  },
  {
    id: 'template_6',
    title: 'Financial Responsibilities Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Detailed Financial Responsibilities Agreement

Date: [Date]

**Roommate 1:** [Full Name]
**Roommate 2:** [Full Name]

**Property Address:** [Full Address]
**Lease Start Date:** [Date]
**Lease End Date:** [Date]

## 1. Rent Breakdown

### Monthly Rent
- Total rent amount: $[Amount]
- Roommate 1's share: $[Amount] ([Percentage]%)
- Roommate 2's share: $[Amount] ([Percentage]%)

### Room Size Consideration
- Roommate 1's room: [Square feet]
- Roommate 2's room: [Square feet]
- Rent split reflects: [Equal / Proportional to room size]

### Payment Details
- Due date: [Day] of each month
- Payable to: [Landlord name or management company]
- Payment method: [Check / Online transfer / etc.]
- Late fee (if applicable): $[Amount] after [Days] days late
- Who submits payment to landlord: [Person responsible]

## 2. Security Deposit

### Initial Deposit
- Total security deposit: $[Amount]
- Roommate 1 contributed: $[Amount]
- Roommate 2 contributed: $[Amount]
- Receipt/proof provided: [Yes/No]
- Deposit holder: [Landlord/Management company]

### Deposit Return Process
- Distribution based on: [Initial contribution amounts]
- Deductions: [Split proportionally / Based on who caused damage]
- Final walkthrough: [Both roommates present]
- Disputes: [Process for handling]

## 3. Utilities & Services

### Electric
- Estimated monthly cost: $[Amount]
- Split: [50/50 or other arrangement]
- In whose name: [Name]
- Autopay: [Yes/No]
- Settlement: [Monthly via Venmo/Zelle]

### Gas/Heat
- Estimated monthly cost: $[Amount]
- Split: [50/50 or other arrangement]
- In whose name: [Name]
- Autopay: [Yes/No]
- Settlement: [Monthly via Venmo/Zelle]

### Water/Sewer
- Estimated monthly cost: $[Amount]
- Split: [50/50 or other arrangement]
- In whose name: [Name]
- Autopay: [Yes/No]
- Settlement: [Monthly via Venmo/Zelle]

### Internet/WiFi
- Provider: [Company name]
- Monthly cost: $[Amount]
- Speed: [Mbps]
- Split: [50/50 or other arrangement]
- In whose name: [Name]
- Equipment rental: [Included or separate]
- Autopay: [Yes/No]

### Streaming Services
- Service 1: [Netflix, Hulu, etc.]
  - Cost: $[Amount/month]
  - In whose name: [Name]
  - Split: [Yes/No]
- Service 2: [Name]
  - Cost: $[Amount/month]
  - In whose name: [Name]
  - Split: [Yes/No]

### Other Services
- Trash/recycling (if separate): $[Amount]
- Pest control: $[Amount]
- HOA fees (if applicable): $[Amount]
- Parking fees: $[Amount per person]
- Storage unit: $[Amount - who uses/pays]

## 4. Shared Household Expenses

### Cleaning Supplies
- Estimated monthly: $[Amount]
- Who purchases: [Alternating / Split reimbursement]
- Items included: [List - paper towels, cleaner, etc.]

### Paper Products
- Toilet paper: [Who buys, rotation]
- Paper towels: [Who buys, rotation]
- Tissues: [Personal or shared]
- Estimated monthly: $[Amount]

### Kitchen Supplies
- Dish soap: [Shared cost]
- Sponges/brushes: [Shared cost]
- Trash bags: [Shared cost]
- Food storage: [Personal purchase]
- Estimated monthly: $[Amount]

### Basic Pantry Staples (if shared)
- Oil, salt, pepper, etc.: [Shared cost]
- Coffee/tea: [Personal or shared]
- Condiments: [Personal or shared]

### Household Items
- Light bulbs: [Shared cost]
- Batteries: [Shared cost]
- Air filters: $[Amount every X months]
- Furnace filters: $[Amount every X months]

## 5. Furniture & Appliances

### Current Shared Items
| Item | Owner | Purchase Price | Move-Out Plan |
|------|-------|----------------|---------------|
| Couch | [Name] | $[Amount] | [Keep/Split/Sell] |
| Coffee Table | [Name] | $[Amount] | [Keep/Split/Sell] |
| TV | [Name] | $[Amount] | [Keep/Split/Sell] |
| Microwave | [Name] | $[Amount] | [Keep/Split/Sell] |
| Kitchen Table | [Name] | $[Amount] | [Keep/Split/Sell] |

### Future Shared Purchases
- Agreement required: [Both must approve purchases over $[Amount]]
- Payment: [Split 50/50 unless otherwise agreed]
- Ownership: [Belongs to purchaser / Split ownership]
- Documentation: [Keep receipts for shared items]

### Maintenance & Repairs
- Appliance repairs: [Landlord responsibility / Split cost]
- Furniture repairs: [Owner's responsibility]
- Damage caused by one person: [That person pays]

## 6. Food & Groceries

### Grocery Arrangement
- Personal groceries: [Each person buys own]
- Shared items: [List specific items if any]
- Labeling system: [Name on items / Separate shelves]

### Shared Cooking Expenses (if applicable)
- Shared meals: [How often]
- Cooking rotation: [Schedule]
- Cost per meal: [Track and split]

### Borrowing Policy
- Ask before using: [All items / Only expensive items]
- Replacement: [If you finish it, replace it]

## 7. Unexpected Expenses

### Household Emergencies
- Plumbing issues: [Call landlord / Split cost if tenant responsibility]
- Locksmith: [Split if both locked out / Individual pays if personal]
- Pest control: [Split cost]
- Urgent repairs: [Process for approval and payment]

### Damage & Repairs
- Accidental damage: [Person responsible pays]
- Normal wear & tear: [Not charged]
- Unclear cause: [Discuss and split if needed]
- Deep cleaning: [Split if both moving out]

## 8. Monthly Settlement Process

### Payment Timeline
- Utility bills arrive: [Approximate date]
- Settlement calculation: [By X date each month]
- Payment due: [Within X days of calculation]
- Payment method: [Venmo / Zelle / Cash App]

### Tracking System
- Use app/spreadsheet: [Specific tool]
- Who tracks: [Both / Alternating months]
- Review together: [Monthly]
- Keep records: [For entire lease term]

### Sample Monthly Settlement
Example:
- Rent: Paid individually
- Electric: $150 ÷ 2 = $75 each
- Gas: $80 ÷ 2 = $40 each
- Internet: $60 ÷ 2 = $30 each
- Cleaning supplies: $40 ÷ 2 = $20 each
- Total: Roommate 1 owes Roommate 2: $[Amount]

## 9. Late Payments & Issues

### Late Payment Policy
- Grace period: [X days]
- Communication required: [Notify in advance if issue]
- Late fee: [None between roommates / $X per day]
- Repeated lateness: [Consequences]

### Financial Difficulties
- Communicate immediately
- Work out payment plan: [Details]
- Cannot cover rent: [Find temporary solution together]
- Last resort: [Finding replacement roommate]

## 10. Individual Financial Responsibilities

### Personal Expenses (NOT shared)
- Cell phone bills
- Car payments/insurance
- Personal subscriptions
- Clothing/personal items
- Health insurance
- Student loans
- Credit card bills
- Gym memberships
- Personal toiletries

### Credit & Financial Privacy
- No sharing of financial information: [Keep private]
- No cosigning: [Unless explicitly agreed]
- Individual credit: [Separate responsibility]

## 11. Moving Out Financial Settlement

### Final Month
- Rent: [Prorated if mid-month / Full month]
- Utilities: [Split based on usage period]
- Final bills: [Responsibility to pay share]

### Cleaning & Repairs
- Professional cleaning: $[Estimated cost]
- Minor repairs: [List and costs]
- Paint touch-ups: [If required]
- Carpet cleaning: [If required]
- Shared furniture: [Buyout or sell, split proceeds]

### Security Deposit Return
- Expected return: [X weeks after move-out]
- Split according to: [Initial contributions]
- Deductions: [Applied fairly to responsible party]
- Forwarding address: [Provide to landlord]

## 12. Financial Records

### Documentation to Keep
- Lease agreement (copy for each)
- Receipts for security deposit
- Utility account numbers and passwords
- Shared purchase receipts
- Monthly settlement records
- Communication about financial matters

### Tax Considerations
- Rent: [Not tax deductible unless home office]
- Utilities: [Not tax deductible unless home office]
- Work from home: [Individual tax implications]

## Agreement & Signatures

We understand that clear financial agreements prevent disputes. We commit to paying our obligations on time, tracking expenses accurately, and communicating openly about money matters.

**Roommate 1:**
Print Name: _________________
Signature: _________________
Date: _______
Bank/Payment App: [For settlement]

**Roommate 2:**
Print Name: _________________
Signature: _________________
Date: _______
Bank/Payment App: [For settlement]`,
  },
  {
    id: 'template_7',
    title: 'Cleaning & Maintenance Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Comprehensive Cleaning & Maintenance Agreement

Date: [Date]

**Roommate 1:** [Name]
**Roommate 2:** [Name]

**Address:** [Full Address]

## 1. General Cleanliness Standards

### Overall Expectations
- Cleanliness level: [Very clean / Clean / Lived-in]
- Shared spaces: [Always presentable]
- Personal spaces: [Individual preference]
- Before guests: [Extra tidying required]

### Philosophy
- Clean up after yourself immediately
- Don't leave messes for later
- Respect shared spaces as if they're your own
- Deep clean areas before they get bad

## 2. Kitchen Cleaning

### Daily Tasks
**Dishes:**
- Wash within: [Immediately / Within 2 hours / By end of day]
- Dishwasher: [Load as you go / Run when full]
- Hand wash: [Large pots immediately]
- Drying rack: [Empty regularly]
- Put away: [Your own dishes same day]

**Counters:**
- Wipe after: [Every use]
- Cleaning supplies location: [Under sink]
- Crumbs/spills: [Clean immediately]

**Stove/Oven:**
- Wipe stove top: [After each use]
- Spills in oven: [Clean same day]
- Deep clean oven: [Monthly, alternating]

**Sink:**
- Rinse after use: [Remove food particles]
- Clean sink: [Weekly, alternating]
- Disposal: [Run with each use if available]

**Appliances:**
- Microwave: [Wipe after splatters / Weekly deep clean]
- Coffee maker: [Clean after use / Deep clean weekly]
- Toaster: [Empty crumbs weekly]
- Fridge exterior: [Wipe weekly]

### Weekly Tasks (Rotating)
**Week 1: Roommate 1 / Week 2: Roommate 2**

- Sweep/mop floor: [Day: _____]
- Wipe down all counters thoroughly
- Clean exterior of appliances
- Take out trash/recycling
- Wipe down cabinet fronts if needed
- Clean inside microwave
- Organize shared pantry space

### Monthly Tasks (Alternating)
- Deep clean oven
- Clean inside refrigerator (remove old food)
- Wipe down inside cabinets if needed
- Clean under/behind appliances
- Descale coffee maker

## 3. Bathroom Cleaning

### Bathroom Assignments
- If two bathrooms: [Roommate 1: Bathroom A / Roommate 2: Bathroom B]
- If one bathroom: [Shared responsibility - weekly rotation]

### Daily Tasks
- Wipe counter after use
- Hang towels to dry
- Squeegee shower after use (if agreed)
- Flush toilet (obvious but important!)
- Pick up hair from sink/floor

### Weekly Cleaning Rotation
**Roommate 1: Odd weeks / Roommate 2: Even weeks**

**Toilet:**
- Clean bowl with brush
- Wipe down exterior
- Clean base and behind toilet
- Disinfect handle

**Sink & Counter:**
- Scrub sink basin
- Clean faucet and handles
- Wipe and disinfect counter
- Clean mirror
- Organize products

**Shower/Tub:**
- Scrub tub/shower walls
- Clean fixtures and faucet
- Wipe down shower door/curtain
- Remove hair from drain
- Replace/wash bath mat

**Floor:**
- Sweep/vacuum
- Mop with disinfectant
- Clean around toilet base
- Wipe down baseboards if needed

**General:**
- Empty trash can
- Replace toilet paper
- Restock hand soap
- Replace hand towel if needed
- Check for mildew/mold

### Monthly Deep Clean
- Wash shower curtain liner or clean glass door thoroughly
- Grout cleaning if needed
- Cabinet organization
- Deep clean exhaust fan
- Wash bathmats and rugs

## 4. Living Room/Common Areas

### Daily Tidying
- Put away personal items: [Before bed / When leaving]
- Fluff couch pillows
- Fold blankets
- Clear coffee table
- Pick up any trash/dishes

### Weekly Cleaning (Alternating)
**Roommate 1: Week 1, 3 / Roommate 2: Week 2, 4**

- Vacuum/sweep floor: [Day: _____]
- Dust surfaces (tables, shelves, TV stand)
- Wipe down coffee table
- Vacuum/clean couch if needed
- Tidy any magazines/books
- Water plants (if shared)
- Empty trash cans

### Monthly Tasks
- Deep vacuum including under furniture
- Dust ceiling fans and light fixtures
- Clean windows
- Wipe down baseboards
- Organize shelves and storage areas
- Spot clean furniture

## 5. Bedrooms (Personal Responsibility)

### Personal Bedrooms
- Cleaning frequency: [Personal choice]
- Minimum standard: [No food waste, no pests]
- Before guests: [Door closed OK / Should be presentable]
- Trash: [Take to kitchen regularly]

### Courtesy Expectations
- No odors affecting common areas
- No pest attractions (old food/drinks)
- Dirty laundry contained
- Door closed if messy

## 6. Entryway/Hallway

### Daily
- Shoes organized: [On rack / In closet]
- Coats hung up
- Mail sorted (don't let pile up)
- Keys in designated spot

### Weekly (Alternating)
- Sweep/vacuum
- Wipe down door handles
- Organize shoe area
- Dust any furniture

## 7. Trash & Recycling

### Kitchen Trash
- Take out when: [Full / Smelly / [Day of week]]
- Who takes out: [Whoever notices it's full]
- Bin cleaning: [Monthly, alternating]
- New bag: [Replace immediately after taking out]

### Recycling
- Location: [Specify]
- Breakdown boxes: [Required]
- Rinse containers: [Required]
- Take to curb: [Day before pickup]
- Bring bins back: [Day of pickup]

### Collection Schedule
- Trash pickup: [Day of week]
- Recycling pickup: [Day of week]
- Responsibility rotation: [Alternating weeks]
- Reminder system: [Phone alert / Calendar]

## 8. Laundry Areas

### Laundry Room (If shared in unit)
- Clean lint trap: [After every load]
- Wipe down machines: [If you spill detergent]
- Don't leave clothes: [Remove promptly after cycle ends]
- Sweep/mop area: [Monthly, alternating]

### Laundry Supplies
- Detergent: [Personal]
- Dryer sheets: [Personal]
- Shared space: [Keep organized]

## 9. Outdoor Spaces

### Balcony/Patio (if applicable)
- Sweep: [Weekly / Bi-weekly]
- Furniture cleaning: [Monthly]
- Plants (if shared): [Watering schedule]
- Remove trash/debris: [Immediately]
- Deep clean: [Spring and fall]

### Yard (if applicable)
- Mowing: [Schedule]
- Weeding: [Shared responsibility]
- Trash pickup: [Weekly or as needed]

## 10. Supply Management

### Cleaning Supplies to Keep Stocked
**Kitchen:**
- Dish soap
- Sponges
- All-purpose cleaner
- Paper towels
- Trash bags

**Bathroom:**
- Toilet bowl cleaner
- Bathroom cleaner
- Glass cleaner
- Toilet paper

**General:**
- Vacuum bags/filters
- Mop/mop pads
- Broom/dustpan
- Disinfectant wipes

### Who Buys What
- Method: [Split cost / Alternating purchases / Venmo reimbursement]
- Running low notification: [Add to shared list]
- Storage location: [Under kitchen sink / Hall closet]

## 11. Deep Cleaning Schedule

### Quarterly Deep Clean
**Spring (March):**
- Roommate 1: [Areas]
- Roommate 2: [Areas]
- Together: [Full apartment top-to-bottom]

**Summer (June):**
- Windows inside & out
- Behind appliances
- Baseboards throughout

**Fall (September):**
- Ceiling fans & light fixtures
- Cabinets inside & out
- Closets

**Winter (December):**
- Pre-holiday deep clean
- Carpets/rugs
- Walls (marks & scuffs)

### Annual Tasks
- Professional carpet cleaning: [If needed, cost split]
- Dryer vent cleaning: [For safety]
- Major decluttering

## 12. Maintenance Issues

### Reporting Problems
- Notice a problem: [Tell roommate immediately]
- Document with photos
- Contact landlord: [Within 24 hours for serious issues]
- Follow up: [If no response in X days]

### Preventive Maintenance
- Change HVAC filters: [Monthly / As needed]
- Check smoke detector batteries: [Twice yearly]
- Check for leaks: [Regularly]
- Caulk maintenance: [As needed]

### Who Contacts Landlord
- Whoever notices issue: [Reports it]
- Keep both roommates informed
- Follow up together if needed

## 13. Cleaning Violations & Accountability

### Violation Examples
- Leaving dishes for days
- Not completing assigned weekly tasks
- Creating mess and not cleaning
- Repeatedly missing deep clean days
- Not replacing supplies when empty

### Resolution Steps
1. Friendly reminder (first time)
2. House meeting to discuss (second time)
3. Written warning (third time)
4. [Further consequences if pattern continues]

### Compromise & Flexibility
- Busy weeks: [Ask roommate to cover, return favor]
- Sick days: [Other roommate covers]
- Travel: [Arrange coverage or catch up after]

## 14. Cleaning Day Schedule

### Weekly Cleaning Day
- Day chosen: [Saturday morning / Sunday afternoon]
- Time: [Start at ___:___ AM/PM]
- Duration: [Approx. ___ hours]
- Music OK: [Yes/No]
- Reward: [Order takeout / Watch movie after]

### Accountability
- Check-in: [Take photos when done]
- Inspection: [Optional walk-through together]
- Feedback: [Give constructive feedback kindly]

## Agreement

We commit to maintaining a clean, healthy, and pleasant living environment. We understand that cleanliness affects quality of life and will respect our shared commitment to these standards.

**Roommate 1:** _________________
Date: _______

**Roommate 2:** _________________
Date: _______

**POSTED COPY:** Keep a copy of weekly rotation schedule visible (on fridge or bulletin board)`,
  },
  {
    id: 'template_8',
    title: 'Guest & Social Life Agreement',
    isTemplate: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    content: `# Guest & Social Life Agreement

Date: [Date]

**Roommate 1:** [Name]
**Roommate 2:** [Name]

**Address:** [Full Address]

## 1. General Guest Philosophy

### Our Social Styles
**Roommate 1:**
- Social level: [Very social / Moderate / Introverted]
- Guest frequency preference: [Often / Sometimes / Rarely]
- Entertaining comfort: [Love hosting / Occasional / Prefer going out]

**Roommate 2:**
- Social level: [Very social / Moderate / Introverted]
- Guest frequency preference: [Often / Sometimes / Rarely]
- Entertaining comfort: [Love hosting / Occasional / Prefer going out]

### Shared Expectations
- Balance: [Both roommates have equal right to have guests]
- Respect: [Always consider roommate's schedule and comfort]
- Communication: [Key to successful cohabitation]
- Home priority: [This is home first, social space second]

## 2. Daytime Guests (Before 10 PM)

### Casual Visitors
- Advance notice required: [None / Text when arriving / 1 hour / 1 day]
- Maximum guests at once: [Number without advance discussion]
- Guest access: [Living room / Kitchen / Own bedroom only]
- Duration: [No limit for reasonable visits]

### Study Groups / Work Meetings
- Advance notice: [1 day]
- Maximum group size: [Number]
- Preferred location: [Living room / Kitchen table / Own room]
- Noise level: [Keep reasonable]
- Cleanup: [Host responsible]

### Romantic Partners (Daytime)
- Introduce early: [First few visits]
- Make comfortable: [Friendly but not intrusive]
- Alone time: [Respect closed doors]
- Shared spaces: [Welcome to use]

## 3. Evening Guests (After 10 PM)

### Weeknight Evenings (Sunday-Thursday)
- Advance notice: [Day of / 1 day / 2 days]
- Maximum guests: [Number]
- Noise level: [Quiet / Low / Moderate]
- End time: [Midnight / 1 AM / Flexible]
- Location: [Living room OK / Own room preferred]

### Weekend Evenings (Friday-Saturday)
- Advance notice: [Day of / 1 day / 2 days]
- Maximum guests: [Number]
- Noise level: [Moderate / Flexible]
- End time: [More flexible / Specific time]

## 4. Overnight Guests

### Romantic Partners
**Roommate 1's Partner:**
- Maximum consecutive nights: [Number] nights
- Maximum nights per month: [Number] nights
- Advance notice: [Day of / 1 day for first night]
- Bathroom expectations: [Be quick, tidy, bring own toiletries]
- Kitchen use: [Welcome, clean up after]
- Overnight parking: [Guest spot #___ / Street parking]

**Roommate 2's Partner:**
- Maximum consecutive nights: [Number] nights
- Maximum nights per month: [Number] nights
- Advance notice: [Day of / 1 day for first night]
- Bathroom expectations: [Be quick, tidy, bring own toiletries]
- Kitchen use: [Welcome, clean up after]
- Overnight parking: [Guest spot #___ / Street parking]

### Long-term Partner Considerations
- If staying frequently: [Consider utilities contribution]
- Becoming too frequent: [Discuss openly]
- Essentially living here: [Not acceptable without discussion]

### Friends & Family Staying Over
- Advance notice: [3-7 days]
- Maximum consecutive nights: [Number]
- Sleep arrangements: [Couch / Air mattress / Roommate's room]
- Bathroom scheduling: [Coordinate morning routines]
- Keys: [Not to be given without permission]

### Out-of-Town Visitors
- Extended family/friend visits: [Advance notice: 1-2 weeks]
- Maximum duration: [Number] nights
- Special accommodations: [Discuss specific needs]
- Roommate cooperation: [Be extra welcoming]
- Compensation: [If utilities notably affected]

## 5. Guest Behavior Expectations

### Guest Responsibilities (Host ensures)
- Respect for property
- Noise considerations
- Bathroom cleanliness
- No smoking inside (if applicable)
- No drugs (or follow household policy)
- Remove shoes: [Yes/No/Optional]
- Meet roommate: [Introduction within first few visits]

### Unacceptable Behavior
- Rudeness to roommate
- Excessive noise/partying
- Using roommate's personal items
- Going in roommate's room without permission
- Leaving messes
- Showing up drunk/disorderly
- Bringing uninvited guests

## 6. Parties & Gatherings

### Small Gatherings (5-10 people)
- Advance notice: [1 week]
- Maximum frequency: [Once per month per person]
- Roommate's option: [Join / Go out / Stay in room]
- Noise level: [Indoor voices / Music allowed]
- End time: [Midnight / 1 AM / 2 AM]
- Guest list: [Inform roommate generally who's coming]

### Medium Parties (10-20 people)
- Advance notice: [2 weeks]
- Both roommates agree: [Required]
- Frequency: [2-3 times per year per person]
- Roommate participation: [Not required but invited]
- Noise control: [Music at reasonable volume]
- End time: [1 AM / 2 AM]
- Preparation: [Extra cleaning beforehand]
- Cleanup: [Immediately after or next morning]

### Large Parties (20+ people)
- Advance discussion: [1 month]
- Both roommates must agree
- Very rare occasion: [Birthday / Special celebration]
- Full planning meeting: [Required]
- Potential issues: [Neighbors, parking, noise, damage]
- Security deposit risk: [Consider carefully]
- Roommate opt-out: [Can leave for night, help plan return]

## 7. Party Planning & Responsibilities

### Before the Party
- Clean common areas: [Day before]
- Hide valuables: [Both roommates secure personal items]
- Bathrooms stocked: [Extra TP, hand soap, towels]
- Parking plan: [Where guests should park]
- Neighbor notification: [Optional but courteous]
- Roommate's bedroom: [Off-limits, lock if desired]

### During the Party
- Host responsibilities:
  - Manage guests and noise
  - Keep party in designated areas
  - Monitor alcohol consumption
  - Ensure no one drives drunk
  - Prevent property damage
  - Respect roommate's space
  - Keep bathroom clean throughout

### After the Party
- Cleanup timeline: [Same night / By noon next day]
- Minimum cleanup:
  - All trash removed
  - Bottles/cans to recycling
  - Floors swept/vacuumed
  - Kitchen cleaned
  - Bathroom cleaned
  - Furniture back in place
  - No lingering odors
- Damage: [Host responsible for repairs/replacement]

## 8. Romantic Relationships & Dating

### New Relationships
- Introduce early: [First few visits]
- Keep PDA reasonable: [In shared spaces]
- Noise considerations: [Keep private sounds private]
- Roommate's comfort: [Check in periodically]
- Still maintain roommate time: [Don't become strangers]

### Established Relationships
- Treat partner with respect
- Include in appropriate household discussions
- Reasonable overnight frequency: [As outlined above]
- Balance: [Don't neglect roommate friendship]
- If issues arise: [Discuss privately with roommate]

### Relationship Problems
- Don't put roommate in middle
- Keep drama to bedroom with door closed
- No yelling/fighting in shared spaces
- If partner needs to leave: [They leave, not roommate]
- Breakups: [Ex-partner no longer welcome without discussion]

## 9. Guest Bathroom & Shared Space Use

### Bathroom Protocol for Guests
- Use guest towels: [Provide disposable or specific towels]
- Don't use roommate's products
- Clean sink after use
- Courtesy flush
- Overnight guests: [Bring own toiletries]
- Shower use: [OK with advance notice]

### Kitchen Protocol for Guests
- Light snacks/drinks: [Always OK]
- Cooking meals: [Ask first if extensive]
- Use provided plates/cups: [Don't use roommate's personal items]
- Clean up immediately
- Don't take leftovers without asking

### Living Room Protocols
- Respect seating: [Everyone welcome]
- TV/music: [Consult with roommate]
- Volume: [Keep reasonable]
- Food/drinks: [Use coasters, clean up spills]

## 10. Keys & Property Access

### Giving Out Keys
- Apartment keys: [Never give without both roommates agreeing]
- Building keys/fobs: [Same policy]
- Gate codes: [Can share with overnight guests]
- Lockbox: [Not without permission]
- Emergency: [Discuss specific situations]

### Guest Entry When Roommate Home Alone
- Doorbell/knock: [Required]
- Guest lets themselves in: [Not acceptable]
- Roommate sleeping: [Quiet entry after text warning]

## 11. Special Situations

### Roommate Out of Town
- Guest limits: [Still apply / Slightly relaxed]
- Extra guests OK: [Only with permission]
- Multi-day party: [Not acceptable]
- Respect property: [Even more important]
- Keep roommate updated: [Photos/texts welcomed]

### Sick Roommate
- Guest visits: [Limit to essential only]
- Noise level: [Extra quiet]
- Overnight guests: [Postpone if possible]
- Partner care: [OK for short visits]

### Finals/Big Work Deadlines
- Reduce guests: [Limit to essential]
- Noise level: [Extra quiet]
- Partner overnight: [Extremely quiet]
- Show support: [Encourage rather than social]

### Holidays
- Holiday gatherings: [Plan ahead together]
- Roommate's family visiting: [Be welcoming]
- Holiday parties: [Follow party guidelines]
- Decorations: [Shared space requires agreement]

## 12. Problem Resolution

### Communication
- Issue with guest: [Tell host immediately or shortly after]
- Issue with guest frequency: [House meeting]
- Roommate uncomfortable: [Always takes priority]
- Compromise: [Both may need to adjust]

### Violations
First time: Friendly discussion
Second time: Formal house meeting
Third time: Written warning
Continuing: [Serious conversation about living arrangement]

## 13. Guest Registry (Optional)

### Overnight Guest Tracker
- Use shared calendar/app: [Google Calendar, etc.]
- Log overnight guests: [Transparency]
- Track frequency: [Ensure fairness]
- Review monthly: [Check balance]

## 14. Mutual Promises

**We both promise to:**
- Give advance notice as outlined
- Keep guest behavior in check
- Clean up after gatherings
- Respect each other's space and peace
- Be honest about comfort levels
- Adjust if something isn't working
- Remember this is both our home
- Balance social life with consideration
- Never make roommate feel unwelcome in own home
- Discuss issues calmly and promptly

## Agreement

We recognize that having guests enriches our lives but must be balanced with respect for our shared home. We commit to these guidelines and will communicate openly about any concerns.

**Roommate 1:** _________________
Date: _______

**Roommate 2:** _________________
Date: _______

**Note:** Review this agreement every 3-6 months to adjust as needed.`,
  },
];
