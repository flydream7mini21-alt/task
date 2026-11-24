import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileSyncService, StoredFile } from '../../../../services/file-sync.service';

@Component({
  selector: 'app-files-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './files-tab.html',
  styleUrl: './files-tab.css'
})
export class FilesTab {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  activeScope: 'shared' | 'private' = 'private';
  selectedExtension: string = 'all';

  // 新規メモ・コード作成フォーム用
  showCreateModal: boolean = false;
  newFileName: string = '';
  newFileExt: string = 'txt';
  newFileContent: string = '';

  constructor(public fileService: FileSyncService) {}

  get filteredFiles(): StoredFile[] {
    return this.fileService.files.filter(file => {
      const matchScope = file.scope === this.activeScope;
      const matchExt = this.selectedExtension === 'all' || file.extension === this.selectedExtension;
      return matchScope && matchExt;
    });
  }

  switchScope(scope: 'shared' | 'private') {
    this.activeScope = scope;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // PCから選んだファイル（複数選択可）を永続保存して表示
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < input.files.length; i++) {
      const selectedFile = input.files[i];
      const fileName = selectedFile.name;
      const ext = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : 'txt';

      const newFile: StoredFile = {
        id: (Date.now() + i).toString(),
        name: fileName,
        extension: ext,
        author: this.activeScope === 'private' ? '自分' : '市川',
        date: today,
        scope: this.activeScope,
        size: this.fileService.formatFileSize(selectedFile.size),
        blob: selectedFile // Fileオブジェクト自体がBlobなのでそのまま保存可能
      };

      await this.fileService.addFile(newFile);
    }

    this.selectedExtension = 'all';
    input.value = '';
  }

  // 新規ファイル作成（これもIndexedDBに永続保存される）
  async createNewFile() {
    if (!this.newFileName.trim()) {
      alert('ファイル名を入力してください。');
      return;
    }

    const fullFileName = `${this.newFileName.trim()}.${this.newFileExt}`;
    const today = new Date().toISOString().split('T')[0];
    const blob = new Blob([this.newFileContent], { type: 'text/plain;charset=utf-8' });

    const newFile: StoredFile = {
      id: Date.now().toString(),
      name: fullFileName,
      extension: this.newFileExt,
      author: this.activeScope === 'private' ? '自分' : '市川',
      date: today,
      scope: this.activeScope,
      size: this.fileService.formatFileSize(blob.size),
      blob: blob
    };

    await this.fileService.addFile(newFile);

    this.newFileName = '';
    this.newFileContent = '';
    this.showCreateModal = false;
  }

  async shareFileToTeam(file: StoredFile) {
    await this.fileService.shareToTeam(file);
    alert(`「${file.name}」をチーム共有用タブに公開しました！`);
  }

  async deleteFile(id: string) {
    await this.fileService.deleteFile(id);
  }

  // 拡張子に応じたアイコン
  getFileIcon(ext: string): string {
    switch (ext) {
      case 'xlsx': case 'xls': case 'csv': return '📊';
      case 'docx': case 'doc': return '📘';
      case 'pptx': case 'ppt': return '📙';
      case 'pdf': return '📕';
      case 'ts': case 'js': case 'py': case 'java': case 'html': case 'css': return '💻';
      case 'txt': case 'md': return '📝';
      default: return '📁';
    }
  }

  // 拡張子ごとの色分け用CSSクラス名を返す
  getExtensionColorClass(ext: string): string {
    switch (ext) {
      case 'xlsx': case 'xls': case 'csv':
        return 'ext-excel';   // 緑（Excel系）
      case 'docx': case 'doc':
        return 'ext-word';    // 青（Word系）
      case 'pptx': case 'ppt':
        return 'ext-ppt';     // オレンジ（PowerPoint系）
      case 'pdf':
        return 'ext-pdf';     // 赤（PDF）
      case 'ts': case 'tsx':
        return 'ext-ts';      // シアン（TypeScript）
      case 'js': case 'jsx':
        return 'ext-js';      // 黄色（JavaScript）
      case 'py':
        return 'ext-python';  // 緑青（Python）
      case 'java':
        return 'ext-java';    // 赤橙（Java）
      case 'html': case 'css':
        return 'ext-web';     // 紫（Web系）
      default:
        return 'ext-default'; // グレー（その他）
    }
  }
}