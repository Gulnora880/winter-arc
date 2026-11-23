-- WINTER ARC · Supabase schema
-- Run in Supabase SQL editor (once).

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  email text not null,
  avatar_url text,
  character_id text default 'luffy',
  challenge_start date default current_date,
  theme text default 'dark',
  notifications_enabled boolean default true,
  sound_enabled boolean default true,
  snow_enabled boolean default true,
  voice_enabled boolean default false,
  voice_volume real default 0.7,
  voice_rate real default 1.0,
  voice_name text,
  voice_quiet_start int default 22,
  voice_quiet_end int default 8,
  created_at timestamptz default now()
);

create table if not exists user_progress (
  user_id uuid primary key references auth.users on delete cascade,
  xp int default 0,
  level int default 1,
  total_tasks_done int default 0,
  total_habits_done int default 0,
  active_days int default 0,
  best_streak int default 0,
  last_active_date date,
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  category text default 'Other',
  priority text default 'medium',
  due_time time,
  due_date date default current_date,
  completed boolean default false,
  completed_at timestamptz,
  xp_reward int default 10,
  created_at timestamptz default now()
);
create index if not exists tasks_user_date_idx on tasks(user_id, due_date);

create table if not exists habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  icon text default '⭐',
  color text default '#80BFFF',
  frequency text default 'daily',
  target_time time,
  created_at timestamptz default now()
);

create table if not exists habit_records (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid not null references habits on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  date date not null default current_date,
  completed boolean default false,
  created_at timestamptz default now(),
  unique(habit_id, date)
);

create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  timeframe text default 'month',
  deadline date,
  progress int default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists achievements (
  id text primary key,
  name text not null,
  description text,
  icon text,
  condition_type text,
  condition_value int
);

create table if not exists user_achievements (
  user_id uuid references auth.users on delete cascade,
  achievement_id text references achievements on delete cascade,
  unlocked_at timestamptz default now(),
  primary key (user_id, achievement_id)
);

create table if not exists xp_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  amount int not null,
  reason text,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  body text,
  time_of_day time not null,
  enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists daily_progress (
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  tasks_done int default 0,
  tasks_total int default 0,
  habits_done int default 0,
  habits_total int default 0,
  xp_earned int default 0,
  primary key (user_id, date)
);

-- Seed achievements
insert into achievements (id, name, description, icon, condition_type, condition_value) values
  ('first_step',   'FIRST STEP',   'Первая выполненная задача', '🚀', 'tasks', 1),
  ('seven_days',   '7 DAYS',       '7 дней активности',         '🔥', 'days',  7),
  ('thirty_days',  '30 DAYS',      '30 дней активности',        '💎', 'days',  30),
  ('fifty_tasks',  'STUDY MASTER', 'Выполнено 50 задач',        '📚', 'tasks', 50),
  ('perfect_day',  'PERFECT DAY',  'Выполнен весь дневной план','🌟', 'perfect', 1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- TRIGGERS: auto-profile on signup
-- ---------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
    new.email
  );
  insert into user_progress (user_id) values (new.id);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Award XP atomically
create or replace function public.award_xp(p_user uuid, p_amount int, p_reason text)
returns user_progress language plpgsql security definer set search_path = public as $$
declare v_progress user_progress;
begin
  insert into xp_history(user_id, amount, reason) values (p_user, p_amount, p_reason);
  update user_progress
    set xp = xp + p_amount,
        level = greatest(1, floor((xp + p_amount) / 100.0) + 1)::int,
        updated_at = now()
    where user_id = p_user
    returning * into v_progress;
  return v_progress;
end; $$;

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
alter table profiles           enable row level security;
alter table user_progress      enable row level security;
alter table tasks              enable row level security;
alter table habits             enable row level security;
alter table habit_records      enable row level security;
alter table goals              enable row level security;
alter table notes              enable row level security;
alter table achievements       enable row level security;
alter table user_achievements  enable row level security;
alter table xp_history         enable row level security;
alter table notifications      enable row level security;
alter table daily_progress     enable row level security;

create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

create policy "own progress all"     on user_progress     for all using (auth.uid() = user_id);
create policy "own tasks all"        on tasks             for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own habits all"       on habits            for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own habit_records"    on habit_records     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own goals all"        on goals             for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own notes all"        on notes             for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "read achievements"    on achievements      for select using (true);
create policy "own achievements"     on user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own xp"               on xp_history        for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own notifications"    on notifications     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own daily_progress"   on daily_progress    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);