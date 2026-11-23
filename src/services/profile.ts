import { supabase } from '../lib/supabase'
import type { Profile, UserProgress } from '../types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return (data as Profile) ?? null
}

export async function updateProfile(userId: string, patch: Partial<Profile>) {
  const { error } = await supabase.from('profiles').update(patch).eq('id', userId)
  if (error) throw error
}

export async function getProgress(userId: string): Promise<UserProgress | null> {
  const { data } = await supabase.from('user_progress').select('*').eq('user_id', userId).single()
  return (data as UserProgress) ?? null
}

export async function awardXP(userId: string, amount: number, reason: string) {
  const { data, error } = await supabase.rpc('award_xp', { p_user: userId, p_amount: amount, p_reason: reason })
  if (error) throw error
  return data as UserProgress
}

export async function touchActiveDay(userId: string) {
  const { data: prog } = await supabase.from('user_progress').select('*').eq('user_id', userId).single()
  if (!prog) return
  const today = new Date().toISOString().slice(0, 10)
  if (prog.last_active_date === today) return
  const wasYesterday = (() => {
    if (!prog.last_active_date) return false
    const y = new Date(); y.setDate(y.getDate() - 1)
    return prog.last_active_date === y.toISOString().slice(0, 10)
  })()
  await supabase.from('user_progress').update({
    active_days: prog.active_days + 1,
    last_active_date: today,
    updated_at: new Date().toISOString()
  }).eq('user_id', userId)
  if (wasYesterday) {
    const newStreak = (prog.best_streak || 0) + 1
    await supabase.from('user_progress').update({ best_streak: newStreak }).eq('user_id', userId)
  }
}