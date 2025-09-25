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

create table if not exists recovery_logs (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references practitioner_assignments(id) on delete cascade,
  practitioner_id uuid not null references profiles(id) on delete cascade,
  progress_notes text not null,
  exercises text,
  pain_level int,
  mobility_score int,
  next_session_plan text,
  date_logged timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  practitioner_id uuid not null references profiles(id) on delete cascade,
  assignment_id uuid references practitioner_assignments(id) on delete set null,
  appointment_date timestamptz not null,
  duration_minutes int not null default 45,
  status text not null default 'scheduled' check (status in ('scheduled','confirmed','completed','cancelled','no_show')),
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  assignment_id uuid references practitioner_assignments(id) on delete set null,
  message text not null,
  read boolean not null default false,
  sent_at timestamptz not null default now()
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references profiles(id) on delete cascade,
  assignment_id uuid references practitioner_assignments(id) on delete set null,
  file_url text not null,
  file_type text not null,
  uploaded_at timestamptz not null default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table injuries enable row level security;
alter table practitioner_assignments enable row level security;
alter table recovery_logs enable row level security;
alter table appointments enable row level security;
alter table messages enable row level security;
alter table files enable row level security;

-- Helper function: check if user is admin
create or replace function is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (select 1 from profiles p where p.id = uid and p.role = 'admin');
$$;

-- Helper: check practitioner assigned to student/injury
create or replace function is_practitioner_assigned(uid uuid, student uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from practitioner_assignments pa
    where pa.practitioner_id = uid and pa.student_id = student and pa.active = true
  );
$$;

-- Profiles policies
create policy "profiles read own or admin" on profiles
  for select using (
    auth.uid() = id or is_admin(auth.uid())
  );

create policy "profiles update self or admin" on profiles
  for update using (
    auth.uid() = id or is_admin(auth.uid())
  );

-- Injuries policies
create policy "injuries read own, assigned, or admin" on injuries
  for select using (
    student_id = auth.uid() or
    is_admin(auth.uid()) or
    is_practitioner_assigned(auth.uid(), student_id)
  );

create policy "injuries insert by student self or admin" on injuries
  for insert with check (
    student_id = auth.uid() or is_admin(auth.uid())
  );

create policy "injuries update by student self (limited) or admin or assigned practitioner" on injuries
  for update using (
    student_id = auth.uid() or is_admin(auth.uid()) or is_practitioner_assigned(auth.uid(), student_id)
  );

-- Assignments policies
create policy "assignments read related or admin" on practitioner_assignments
  for select using (
    student_id = auth.uid() or practitioner_id = auth.uid() or is_admin(auth.uid())
  );

create policy "assignments insert admin only" on practitioner_assignments
  for insert with check (
    is_admin(auth.uid())
  );

create policy "assignments update admin only" on practitioner_assignments
  for update using (is_admin(auth.uid()));

-- Recovery logs policies
create policy "recovery logs read related or admin" on recovery_logs
  for select using (
    is_admin(auth.uid()) or
    practitioner_id = auth.uid() or
    exists (
      select 1 from practitioner_assignments pa
      where pa.id = recovery_logs.assignment_id and pa.student_id = auth.uid()
    )
  );

create policy "recovery logs insert practitioner assigned or admin" on recovery_logs
  for insert with check (
    is_admin(auth.uid()) or
    exists (
      select 1 from practitioner_assignments pa
      where pa.id = assignment_id and pa.practitioner_id = auth.uid() and pa.active = true
    )
  );

-- Appointments policies
create policy "appointments read related or admin" on appointments
  for select using (
    student_id = auth.uid() or practitioner_id = auth.uid() or is_admin(auth.uid())
  );

create policy "appointments insert student or practitioner or admin" on appointments
  for insert with check (
    student_id = auth.uid() or practitioner_id = auth.uid() or is_admin(auth.uid())
  );

-- Messages policies
create policy "messages read participant or admin" on messages
  for select using (
    sender_id = auth.uid() or receiver_id = auth.uid() or is_admin(auth.uid())
  );

create policy "messages insert participant only" on messages
  for insert with check (
    sender_id = auth.uid()
  );

-- Files policies
create policy "files read related or admin" on files
  for select using (
    uploaded_by = auth.uid() or is_admin(auth.uid()) or
    exists (
      select 1 from practitioner_assignments pa
      where pa.id = files.assignment_id and (pa.student_id = auth.uid() or pa.practitioner_id = auth.uid())
    )
  );

create policy "files insert uploader or admin" on files
  for insert with check (
    uploaded_by = auth.uid() or is_admin(auth.uid())
  );

-- Storage bucket for uploads
-- Requires 'supabase' extension; run in Supabase SQL editor
select
  case
    when exists (select 1 from storage.buckets where id = 'user-files') then null
    else storage.create_bucket('user-files', false, 'private user files')
  end;

-- Storage RLS on storage.objects
alter table storage.objects enable row level security;

-- Students can manage files under student/{uid}/*; practitioners under practitioner/{uid}/*
create policy "storage read own and related or admin" on storage.objects
  for select using (
    bucket_id = 'user-files' and (
      is_admin(auth.uid()) or
      (owner = auth.uid()) or
      -- allow practitioners and students to read files attached to their assignments via files table
      exists (
        select 1 from files f
        where f.file_url like '%' || storage.objects.id::text || '%'
        and (
          f.uploaded_by = auth.uid() or
          exists (
            select 1 from practitioner_assignments pa
            where pa.id = f.assignment_id and (pa.student_id = auth.uid() or pa.practitioner_id = auth.uid())
          ) or
          is_admin(auth.uid())
        )
      )
    )
  );

-- Optional migration for existing projects: add sport column if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'sport'
  ) then
    alter table profiles add column sport text;
  end if;
end $$;

create policy "storage insert owner only" on storage.objects
  for insert with check (
    bucket_id = 'user-files' and owner = auth.uid()
  );

create policy "storage update delete owner or admin" on storage.objects
  for all using (
    bucket_id = 'user-files' and (owner = auth.uid() or is_admin(auth.uid()))
  );

