import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 分割したタブのコンポーネントをインポート
import { OverviewTab } from './tabs/overview-tab/overview-tab';
import { MembersTab } from './tabs/members-tab/members-tab';
import { FilesTab } from './tabs/files-tab/files-tab';
import { QrTab } from './tabs/qr-tab/qr-tab'; // ✨ QrTabをインポート


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    OverviewTab, 
    MembersTab, 
    FilesTab,
    QrTab // ✨ importsに追加
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // 現在表示しているタブ ('overview' | 'members' | 'files' | 'qr')
  activeTab: string = 'overview';

  // タブを切り替える関数
  switchTab(tabName: string) {
    this.activeTab = tabName;
  }
}