import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-tab.html',
  styleUrl: './qr-tab.css'
})
export class QrTab {
  inputText: string = 'http://localhost:4200/signup';
  qrCodeDataUrl: string = '';

  constructor() {
    this.generateQrCode();
  }

  async generateQrCode() {
    if (!this.inputText.trim()) {
      this.qrCodeDataUrl = '';
      return;
    }
    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(this.inputText, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.error('QRコード生成エラー:', err);
    }
  }
}


