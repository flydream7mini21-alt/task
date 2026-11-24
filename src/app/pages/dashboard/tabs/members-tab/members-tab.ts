import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-members-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members-tab.html',
  styleUrl: './members-tab.css'
})
export class MembersTab {
  inviteEmail: string = '';
  inviteRole: string = 'developer';

  // 招待メール（mailto）を送信・起動する関数
  inviteMember() {
    if (!this.inviteEmail) {
      alert('メールアドレスを入力してください。');
      return;
    }
    const subject = encodeURIComponent('チーム管理アプリへの招待');
    const body = encodeURIComponent(`こんにちは！\n\nチーム管理アプリへご招待します。\n割り当てられた役職: ${this.inviteRole}\n\nよろしくお願いいたします！`);
    window.location.href = `mailto:${this.inviteEmail}?subject=${subject}&body=${body}`;
  }
}