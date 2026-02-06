import Phaser from 'phaser';
import * as C from '../core/Constants.js';
import { gameState } from '../core/GameState.js';
import { stopMusic } from '../audio/MusicManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(C.COLORS.BG_TOP, C.COLORS.BG_TOP, C.COLORS.BG_BOTTOM, C.COLORS.BG_BOTTOM, 1);
    bg.fillRect(0, 0, C.GAME_WIDTH, C.GAME_HEIGHT);
    
    // Title
    this.add.text(C.GAME_WIDTH / 2, 100, '演奏結束', {
      fontFamily: 'Georgia, serif',
      fontSize: '42px',
      color: '#ffd93d'
    }).setOrigin(0.5);
    
    // Score
    this.add.text(C.GAME_WIDTH / 2, 180, '分數', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#888888'
    }).setOrigin(0.5);
    
    this.add.text(C.GAME_WIDTH / 2, 240, gameState.score.toString(), {
      fontFamily: 'Georgia, serif',
      fontSize: '72px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Grade
    const accuracy = gameState.getAccuracy();
    let grade, gradeColor, gradeCN;
    if (accuracy >= 95) { grade = 'S'; gradeColor = '#ffd93d'; gradeCN = '完美'; }
    else if (accuracy >= 85) { grade = 'A'; gradeColor = '#ff6b9d'; gradeCN = '優秀'; }
    else if (accuracy >= 75) { grade = 'B'; gradeColor = '#00d4aa'; gradeCN = '良好'; }
    else if (accuracy >= 60) { grade = 'C'; gradeColor = '#ffffff'; gradeCN = '及格'; }
    else { grade = 'D'; gradeColor = '#666666'; gradeCN = '加油'; }
    
    this.add.text(C.GAME_WIDTH / 2, 340, grade, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '100px',
      color: gradeColor
    }).setOrigin(0.5);
    
    this.add.text(C.GAME_WIDTH / 2, 410, gradeCN, {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: gradeColor
    }).setOrigin(0.5).setAlpha(0.8);
    
    // Stats
    const statsY = 490;
    const stats = [
      { label: '最高連擊', value: gameState.maxCombo + 'x', color: '#ffd93d' },
      { label: '準確度', value: gameState.getAccuracy() + '%', color: '#00d4aa' },
      { label: '完美', value: gameState.perfectCount, color: '#ff6b9d' },
      { label: '太棒', value: gameState.greatCount, color: '#00d4aa' },
      { label: '不错', value: gameState.goodCount, color: '#ffd93d' },
      { label: '失誤', value: gameState.missCount, color: '#666666' }
    ];
    
    stats.forEach((stat, i) => {
      const y = statsY + i * 40;
      
      this.add.text(C.GAME_WIDTH / 2 - 60, y, stat.label, {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: '#888888'
      }).setOrigin(0, 0.5);
      
      this.add.text(C.GAME_WIDTH / 2 + 80, y, stat.value.toString(), {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: stat.color
      }).setOrigin(1, 0.5);
    });
    
    // Retry button
    const retryBtn = this.add.rectangle(C.GAME_WIDTH / 2, 770, 200, 60, 0xff6b9d);
    retryBtn.setStrokeStyle(2, 0xffd93d, 0.5);
    retryBtn.setInteractive({ useHandCursor: true });
    
    this.add.text(C.GAME_WIDTH / 2, 770, '再來一次', {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    retryBtn.on('pointerover', () => retryBtn.setFillStyle(0xff8bbd));
    retryBtn.on('pointerout', () => retryBtn.setFillStyle(0xff6b9d));
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // Menu button
    const menuBtn = this.add.rectangle(C.GAME_WIDTH / 2, 850, 150, 45, 0x333333);
    menuBtn.setStrokeStyle(1, 0x666666, 0.5);
    menuBtn.setInteractive({ useHandCursor: true });
    
    this.add.text(C.GAME_WIDTH / 2, 850, '返回', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#888888'
    }).setOrigin(0.5);
    
    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    
    // Report to play.fun
    if (window.game?.playFun) {
      window.game.playFun.addPoints(gameState.score);
    }
  }
}
