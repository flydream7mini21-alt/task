import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  username: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private supabaseService: Supabase,
    private router: Router
  ) {}

  // パスワードの表示・非表示を切り替え
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // 8文字のパスワードを自動生成（記号可・スペース不可）
  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.password = result;
    this.showPassword = true; // 生成したパスワードを確認しやすいよう表示状態にする
  }

  async onSignup() {
    if (!this.username || !this.email || !this.password) {
      alert('すべての項目を入力してください。');
      return;
    }

    if (this.password.includes(' ')) {
      alert('パスワードにスペースは使用できません。');
      return;
    }

    if (this.password.length < 6) {
      alert('パスワードは6文字以上で入力してください。');
      return;
    }

    // Supabaseへ新規登録リクエストを送信
    const { data, error } = await this.supabaseService.signUp(this.email, this.password);

    if (error) {
      alert('登録エラー: ' + error.message);
    } else {
      alert('登録が完了しました！ログイン画面へ移動します。');
      this.router.navigate(['/login']);
    }
  }
}