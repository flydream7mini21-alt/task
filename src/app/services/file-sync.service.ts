import { Injectable } from '@angular/core';

export interface StoredFile {
  id: string;
  name: string;
  extension: string;
  author: string;
  date: string;
  scope: 'shared' | 'private'; // 'shared': チーム共有用, 'private': 自分専用
  size: string;
  blob?: Blob; // PCの電源を切っても消えないように実体データをIndexedDBに保存
}

@Injectable({
  providedIn: 'root'
})
export class FileSyncService {
  files: StoredFile[] = [];

  private readonly DB_NAME = 'TeamAppPersistentFilesDB';
  private readonly STORE_NAME = 'filesStore';

  constructor() {
    // アプリ起動時・リロード時・PC再起動後にIndexedDBから全ファイルを復元
    this.loadFilesFromDB();
  }

  // IndexedDBを開く
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // IndexedDBから保存済みファイルをすべて読み込む
  async loadFilesFromDB(): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const savedFiles: StoredFile[] = request.result || [];
        // 新しい順に並び替え
        savedFiles.sort((a, b) => Number(b.id) - Number(a.id));
        this.files = savedFiles;
      };
    } catch (err) {
      console.error('ファイル復元エラー:', err);
    }
  }

  // ファイルをIndexedDBに永続保存する
  async addFile(fileData: StoredFile): Promise<void> {
    this.files.unshift(fileData);
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).put(fileData);
    } catch (err) {
      console.error('ファイル保存エラー:', err);
    }
  }

  // ファイルをIndexedDBから削除する
  async deleteFile(id: string): Promise<void> {
    this.files = this.files.filter(f => f.id !== id);
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).delete(id);
    } catch (err) {
      console.error('ファイル削除エラー:', err);
    }
  }

  // 自分専用ファイルを「チーム共有用」へコピーして保存
  async shareToTeam(file: StoredFile): Promise<void> {
    const sharedCopy: StoredFile = {
      ...file,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      author: '市川',
      scope: 'shared'
    };
    await this.addFile(sharedCopy);
  }

  // 保存された実体データ(Blob)からファイルを開く・ダウンロードする
  downloadFile(file: StoredFile): void {
    if (!file.blob) {
      alert('ファイルデータが見つかりません。');
      return;
    }
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}