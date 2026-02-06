import Phaser from 'phaser';
import * as C from '../core/Constants.js';
import { gameState } from '../core/GameState.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x1a0a2e, 1);
    bg.fillRect(0, 0, C.GAME_WIDTH, C.GAME_HEIGHT);
    
    // Title
    this.add.text(C.GAME_WIDTH / 2, 120, 'GAME OVER', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '48px',
      color: '#ff6b6b'
    }).setOrigin(0.5);
    
    // Score
    this.add.text(C.GAME_WIDTH / 2, 220, 'SCORE', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '18px',
      color: '#888888'
    }).setOrigin(0.5);
    
    this.add.text(C.GAME_WIDTH / 2, 270, gameState.score.toString(), {
      fontFamily: C.FONT_FAMILY,
      fontSize: '64px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Stats
    const statsY = 380;
    const stats = [
      { label: 'MAX COMBO', value: gameState.maxCombo + 'x', color: '#ffcc00' },
      { label: 'ACCURACY', value: gameState.getAccuracy() + '%', color: '#4ecdc4' },
      { label: 'PERFECT', value: gameState.perfectCount, color: '#00ff88' },
      { label: 'GREAT', value: gameState.greatCount, color: '#44ff44' },
      { label: 'GOOD', value: gameState.goodCount, color: '#ffff44' },
      { label: 'MISS', value: gameState.missCount, color: '#ff4444' }
    ];
    
    stats.forEach((stat, i) => {
      const y = statsY + i * 45;
      
      this.add.text(C.GAME_WIDTH / 2 - 80, y, stat.label, {
        fontFamily: C.FONT_FAMILY,
        fontSize: '16px',
        color: '#666666'
      }).setOrigin(0, 0.5);
      
      this.add.text(C.GAME_WIDTH / 2 + 80, y, stat.value.toString(), {
        fontFamily: C.FONT_FAMILY,
        fontSize: '20px',
        color: stat.color
      }).setOrigin(1, 0.5);
    });
    
    // Grade
    const accuracy = gameState.getAccuracy();
    let grade, gradeColor;
    if (accuracy >= 95) { grade = 'S'; gradeColor = '#ffcc00'; }
    else if (accuracy >= 85) { grade = 'A'; gradeColor = '#00ff88'; }
    else if (accuracy >= 75) { grade = 'B'; gradeColor = '#4ecdc4'; }
    else if (accuracy >= 60) { grade = 'C'; gradeColor = '#ffffff'; }
    else { grade = 'D'; gradeColor = '#ff6b6b'; }
    
    this.add.text(C.GAME_WIDTH / 2, 680, grade, {
      fontFamily: C.FONT_FAMILY,
      fontSize: '80px',
      color: gradeColor
    }).setOrigin(0.5);
    
    // Retry button
    const retryBtn = this.add.rectangle(C.GAME_WIDTH / 2, 800, 200, 60, 0x4ecdc4);
    retryBtn.setStrokeStyle(2, 0xffffff, 0.5);
    retryBtn.setInteractive({ useHandCursor: true });
    
    this.add.text(C.GAME_WIDTH / 2, 800, 'RETRY', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '24px',
      color: '#000000'
    }).setOrigin(0.5);
    
    retryBtn.on('pointerover', () => retryBtn.setFillStyle(0x6eeee4));
    retryBtn.on('pointerout', () => retryBtn.setFillStyle(0x4ecdc4));
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // Menu button
    const menuBtn = this.add.rectangle(C.GAME_WIDTH / 2, 880, 150, 40, 0x333333);
    menuBtn.setStrokeStyle(1, 0x666666, 0.5);
    menuBtn.setInteractive({ useHandCursor: true });
    
    this.add.text(C.GAME_WIDTH / 2, 880, 'MENU', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '16px',
      color: '#888888'
    }).setOrigin(0.5);
    
    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    
    // Report score to play.fun
    if (window.game?.playFun) {
      window.game.playFun.addPoints(gameState.score);
    }
  }
}
