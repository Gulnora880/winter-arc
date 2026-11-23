export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  character_id: "luffy" | "itadori" | "midoriya" | string;
  challenge_start: string;
  theme: "dark" | "light";
  notifications_enabled: boolean;
  sound_enabled: boolean;
  snow_enabled: boolean;
  voice_enabled: boolean;
  voice_volume: number;
  voice_rate: number;
  voice_name?: string | null;
  voice_quiet_start: number;
  voice_quiet_end: number;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  xp: number;
  level: number;
  total_tasks_done: number;
  total_habits_done: number;
  active_days: number;
  best_streak: number;
  last_active_date?: string | null;
}

export type Category =
  | "Study"
  | "Health"
  | "Personal"
  | "Work"
  | "Skills"
  | "Sport"
  | "Other";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  category: Category;
  priority: Priority;
  due_time?: string | null;
  due_date: string;
  completed: boolean;
  completed_at?: string | null;
  xp_reward: number;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  frequency: "daily" | "weekly";
  target_time?: string | null;
  created_at: string;
}

export interface HabitRecord {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  timeframe: "day" | "week" | "month" | "92days";
  deadline?: string;
  progress: number;
  status: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface NotificationSchedule {
  id: string;
  user_id: string;
  title: string;
  body?: string;
  time_of_day: string;
  enabled: boolean;
  created_at: string;
}
