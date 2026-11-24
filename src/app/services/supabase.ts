import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  private supabase: SupabaseClient;

  // 先ほど取得したProject URLとanon public keyを貼り付けてください
  private supabaseUrl = 'https://msnetazznqbvchhxfxkr.supabase.co';
  private supabaseKey = 'sb_publishable_0KbhM37RK8EOYSMsuro36g_MJXzwgyI';

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  // 新規登録（サインアップ）
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email: email,
      password: password,
    });
  }

  // ログイン
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  }

  // ログアウト
  async signOut() {
    return await this.supabase.auth.signOut();
  }
}