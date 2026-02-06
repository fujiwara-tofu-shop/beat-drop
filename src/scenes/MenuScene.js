import Phaser from 'phaser';
import * as C from '../core/Constants.js';
import { initMusic, startMenuBGM, stopMusic } from '../audio/MusicManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Chinese synthwave gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(C.COLORS.BG_TOP, C.COLORS.BG_TOP, C.COLORS.BG_BOTTOM, C.COLORS.BG_BOTTOM, 1);
    bg.fillRect(0, 0, C.GAME_WIDTH, C.GAME_HEIGHT);
    
    // Decorative lines
    const lines = this.add.graphics();
    lines.lineStyle(1, 0xffd93d, 0.1);
    for (let i = 0; i < 10; i++) {
      const y = 100 + i * 80;
      lines.lineBetween(0, y, C.GAME_WIDTH, y);
    }
    
    // Title - Chinese
    this.add.text(C.GAME_WIDTH / 2, 160, '節奏之道', {
      fontFamily: 'Georgia, serif',
      fontSize: '64px',
      color: '#ffd93d'
    }).setOrigin(0.5);
    
    // Subtitle - English
    this.add.text(C.GAME_WIDTH / 2, 230, 'BEAT DROP', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '28px',
      color: '#ff6b9d',
      letterSpacing: 8
    }).setOrigin(0.5);
    
    // Tagline
    this.add.text(C.GAME_WIDTH / 2, 290, 'Chinese Synthwave Rhythm', {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#666666'
    }).setOrigin(0.5);
    
    // Instructions
    this.add.text(C.GAME_WIDTH / 2, 400, '點擊節奏', {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#888888'
    }).setOrigin(0.5);
    
    this.add.text(C.GAME_WIDTH / 2, 430, 'TAP THE RHYTHM', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#666666'
    }).setOrigin(0.5);
    
    // Lane preview
    const previewY = 520;
    for (let i = 0; i < C.LANE_COUNT; i++) {
      const x = C.GAME_WIDTH / 2 - 90 + i * 90;
      const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[i]).color;
      
      this.add.circle(x, previewY, 35, color, 0.8);
      this.add.text(x, previewY, C.LANE_NAMES[i], {
        fontFamily: 'Georgia, serif',
        fontSize: '24px',
        color: '#000000'
      }).setOrigin(0.5);
      
      this.add.text(x, previewY + 55, C.LANE_NAMES_EN[i], {
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: C.LANE_COLORS[i]
      }).setOrigin(0.5);
    }
    
    // Keyboard hint
    this.add.text(C.GAME_WIDTH / 2, 620, 'KEYBOARD: A  S  D', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#555555'
    }).setOrigin(0.5);
    
    // Play button
    const playBtn = this.add.rectangle(C.GAME_WIDTH / 2, 720, 220, 70, 0xff6b9d);
    playBtn.setStrokeStyle(2, 0xffd93d, 0.5);
    playBtn.setInteractive({ useHandCursor: true });
    
    const playText = this.add.text(C.GAME_WIDTH / 2, 720, '開始遊戲', {
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    playBtn.on('pointerover', () => {
      playBtn.setFillStyle(0xff8bbd);
    });
    playBtn.on('pointerout', () => {
      playBtn.setFillStyle(0xff6b9d);
    });
    playBtn.on('pointerdown', () => {
      stopMusic();
      this.scene.start('GameScene');
    });
    
    // Credits
    this.add.text(C.GAME_WIDTH / 2, C.GAME_HEIGHT - 50, '藤原製作 🚗', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#444444'
    }).setOrigin(0.5);
    
    // Start BGM on first interaction
    this.input.once('pointerdown', () => {
      initMusic();
      startMenuBGM();
    });
  }
}
