import Phaser from 'phaser';
import * as C from '../core/Constants.js';
import { initMusic, startMenuBGM, stopMusic } from '../audio/MusicManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x1a0a2e, 1);
    bg.fillRect(0, 0, C.GAME_WIDTH, C.GAME_HEIGHT);
    
    // Title
    this.add.text(C.GAME_WIDTH / 2, 180, 'BEAT', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '72px',
      color: '#ff6b6b'
    }).setOrigin(0.5);
    
    this.add.text(C.GAME_WIDTH / 2, 260, 'DROP', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '72px',
      color: '#4ecdc4'
    }).setOrigin(0.5);
    
    // Subtitle
    this.add.text(C.GAME_WIDTH / 2, 330, 'TAP THE RHYTHM', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '18px',
      color: '#888888',
      letterSpacing: 4
    }).setOrigin(0.5);
    
    // Instructions
    const instY = 450;
    this.add.text(C.GAME_WIDTH / 2, instY, 'TAP LANES AS NOTES HIT THE LINE', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '16px',
      color: '#666666'
    }).setOrigin(0.5);
    
    // Lane preview
    const previewY = 520;
    for (let i = 0; i < C.LANE_COUNT; i++) {
      const x = C.GAME_WIDTH / 2 - 100 + i * 65;
      const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[i]).color;
      
      this.add.circle(x, previewY, 25, color, 0.8);
      this.add.text(x, previewY + 45, C.LANE_NAMES[i], {
        fontFamily: C.FONT_FAMILY,
        fontSize: '10px',
        color: C.LANE_COLORS[i]
      }).setOrigin(0.5);
    }
    
    // Keyboard hint
    this.add.text(C.GAME_WIDTH / 2, 600, 'KEYBOARD: A S D F', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '14px',
      color: '#555555'
    }).setOrigin(0.5);
    
    // Play button
    const playBtn = this.add.rectangle(C.GAME_WIDTH / 2, 720, 200, 60, 0x4ecdc4);
    playBtn.setStrokeStyle(2, 0xffffff, 0.5);
    playBtn.setInteractive({ useHandCursor: true });
    
    const playText = this.add.text(C.GAME_WIDTH / 2, 720, 'PLAY', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '24px',
      color: '#000000'
    }).setOrigin(0.5);
    
    playBtn.on('pointerover', () => {
      playBtn.setFillStyle(0x6eeee4);
    });
    playBtn.on('pointerout', () => {
      playBtn.setFillStyle(0x4ecdc4);
    });
    playBtn.on('pointerdown', () => {
      stopMusic();
      this.scene.start('GameScene');
    });
    
    // Credits
    this.add.text(C.GAME_WIDTH / 2, C.GAME_HEIGHT - 40, 'MADE BY FUJIWARA 🚗', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '12px',
      color: '#444444'
    }).setOrigin(0.5);
    
    // Start menu BGM on first interaction
    this.input.once('pointerdown', () => {
      initMusic();
      startMenuBGM();
    });
  }
}
