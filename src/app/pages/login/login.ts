import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(
    private supabaseService: Supabase,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      alert('メールアドレスとパスワードを入力してください。');
      return;
    }

    // Supabaseへログインリクエストを送信
    const { data, error } = await this.supabaseService.signIn(this.email, this.password);

    if (error) {
      alert('ログイン失敗: メールアドレスかパスワードが間違っています。');
    } else {
      // 認証成功でダッシュボードへ遷移
      this.router.navigate(['/dashboard']);
    }
  }
}