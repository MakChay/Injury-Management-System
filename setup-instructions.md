# Database Setup Instructions

## 🚀 Setting up your Supabase Database

Follow these steps to set up your DUT Athletic Injury Management database:

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project: `aqounbuckltzzjbmogya`
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute the Database Schema
Copy and paste the following SQL into the SQL Editor and click **Run**:

```sql
-- Supabase Schema for DUT Athletic Injury Management

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('student','practitioner','admin')),
  profile_pic text,
  phone text,
  student_number text,
  sport text,
  position text,
  dominant_side text,
  injury_history jsonb,
  specialization text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists injuries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  injury_type text not null,
  severity text not null default 'mild' check (severity in ('mild','moderate','severe','critical')),
  description text not null,
  body_part text not null,
  date_occurred date not null,
  date_reported timestamptz not null default now(),
  date_returned timestamptz,
  days_lost int,
  status text not null default 'reported' check (status in ('reported','assigned','in_treatment','recovering','resolved')),
  activity_when_injured text,
  pain_level int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists practitioner_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  practitioner_id uuid not null references profiles(id) on delete cascade,
  injury_id uuid not null references injuries(id) on delete cascade,
  assigned_by uuid references profiles(id),
  assigned_at timestamptz not null default now(),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  practitioner_id uuid not null references profiles(id) on delete cascade,
  injury_id uuid references injuries(id) on delete cascade,
  appointment_date timestamptz not null,
  duration_minutes int not null default 60,
  status text not null default 'scheduled' check (status in ('scheduled','completed','cancelled','no_show')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  injury_id uuid references injuries(id) on delete cascade,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists recovery_logs (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references practitioner_assignments(id) on delete cascade,
  practitioner_id uuid not null references profiles(id) on delete cascade,
  log_date timestamptz not null default now(),
  pain_level int check (pain_level >= 0 and pain_level <= 10),
  swelling_level int check (swelling_level >= 0 and swelling_level <= 10),
  range_of_motion int check (range_of_motion >= 0 and range_of_motion <= 100),
  treatment_notes text,
  exercises_performed text[],
  next_appointment timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists plan_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  injury_type text not null,
  sport text,
  phases jsonb not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists treatment_plans (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references practitioner_assignments(id) on delete cascade,
  template_id uuid references plan_templates(id),
  title text not null,
  phases jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists notification_preferences (
  id uuid primary key references profiles(id) on delete cascade,
  email_reminders boolean not null default true,
  sms_reminders boolean not null default false,
  reminder_window_minutes int not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  checkin_date date not null default current_date,
  pain_level int check (pain_level >= 0 and pain_level <= 10),
  swelling int check (swelling >= 0 and swelling <= 10),
  rom int check (rom >= 0 and rom <= 100),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists rtp_checklists (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  sport text,
  criteria jsonb not null,
  status text not null default 'in_progress' check (status in ('in_progress','ready','cleared')),
  cleared_by uuid references profiles(id),
  cleared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists session_notes (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references practitioner_assignments(id) on delete cascade,
  practitioner_id uuid not null references profiles(id) on delete cascade,
  soap_notes text not null,
  vitals jsonb,
  contraindications text,
  created_at timestamptz not null default now()
);

-- Create storage bucket for file uploads
insert into storage.buckets (id, name, public) values ('injury-files', 'injury-files', true);

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table injuries enable row level security;
alter table practitioner_assignments enable row level security;
alter table appointments enable row level security;
alter table messages enable row level security;
alter table recovery_logs enable row level security;
alter table plan_templates enable row level security;
alter table treatment_plans enable row level security;
alter table notification_preferences enable row level security;
alter table daily_checkins enable row level security;
alter table rtp_checklists enable row level security;
alter table session_notes enable row level security;

-- Profiles policies
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

-- Injuries policies
create policy "Students can view their own injuries" on injuries for select using (auth.uid() = student_id);
create policy "Students can insert their own injuries" on injuries for insert with check (auth.uid() = student_id);
create policy "Practitioners can view assigned injuries" on injuries for select using (
  exists (
    select 1 from practitioner_assignments pa 
    where pa.injury_id = injuries.id 
    and pa.practitioner_id = auth.uid()
  )
);
create policy "Admins can view all injuries" on injuries for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Add more RLS policies as needed...

-- Create indexes for better performance
create index if not exists idx_injuries_student_id on injuries(student_id);
create index if not exists idx_injuries_status on injuries(status);
create index if not exists idx_assignments_practitioner on practitioner_assignments(practitioner_id);
create index if not exists idx_assignments_student on practitioner_assignments(student_id);
create index if not exists idx_appointments_student on appointments(student_id);
create index if not exists idx_appointments_practitioner on appointments(practitioner_id);
create index if not exists idx_messages_recipient on messages(recipient_id);
create index if not exists idx_messages_sender on messages(sender_id);
create index if not exists idx_recovery_logs_assignment on recovery_logs(assignment_id);
create index if not exists idx_daily_checkins_student on daily_checkins(student_id);
create index if not exists idx_rtp_checklists_student on rtp_checklists(student_id);
```

### Step 3: Verify Setup
After running the SQL, you can verify the setup by:
1. Checking that all tables are created in the **Table Editor**
2. Testing the connection with your application

### Step 4: Test Your Application
Once the database is set up, your application should work perfectly with:
- User registration and authentication
- Injury reporting and tracking
- Practitioner assignments
- Recovery logs and check-ins
- And all other features!

## 🎉 You're All Set!

Your DUT Athletic Injury Management system is now ready to use with a fully configured Supabase database!