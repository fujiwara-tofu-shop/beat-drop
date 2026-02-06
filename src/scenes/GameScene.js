import Phaser from 'phaser';
import * as C from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { playLaneSound, playMiss } from '../audio/SoundManager.js';
import { startGameplayBGM, stopMusic } from '../audio/MusicManager.js';
import { addPoints, resetSession } from '../playfun.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.notes = null;
    this.spawnTimer = null;
  }

  create() {
    gameState.reset();
    gameState.isPlaying = true;
    resetSession(); // Reset Play.fun session points
    
    this.createBackground();
    this.createLanes();
    this.createHitZone();
    this.createUI();
    this.setupInput();
    
    this.notes = this.add.group();
    this.patternIndex = 0;
    this.phase = 0; // 0=intro, 1=main, 2=intense, 3=outro
    
    this.startNoteSpawner();
    startGameplayBGM();
    
    // Game timer
    this.gameTime = C.GAME_DURATION;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTime--;
        this.timerText.setText(this.gameTime.toString());
        
        // Phase progression
        if (this.gameTime === 45) this.phase = 1;
        if (this.gameTime === 25) this.phase = 2;
        if (this.gameTime === 10) this.phase = 3;
        
        if (this.gameTime <= 0) {
          this.endGame();
        }
      },
      repeat: C.GAME_DURATION - 1
    });
  }

  createBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(C.COLORS.BG_TOP, C.COLORS.BG_TOP, C.COLORS.BG_BOTTOM, C.COLORS.BG_BOTTOM, 1);
    bg.fillRect(0, 0, C.GAME_WIDTH, C.GAME_HEIGHT);
    
    for (let i = 1; i < C.LANE_COUNT; i++) {
      const x = i * C.LANE_WIDTH;
      const line = this.add.graphics();
      line.lineStyle(1, 0xffd93d, 0.15);
      line.lineBetween(x, 0, x, C.GAME_HEIGHT);
    }
    
    this.add.text(C.GAME_WIDTH / 2, 25, '節奏', {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#ffd93d'
    }).setOrigin(0.5).setAlpha(0.3);
  }

  createLanes() {
    for (let i = 0; i < C.LANE_COUNT; i++) {
      const x = i * C.LANE_WIDTH + C.LANE_WIDTH / 2;
      const color = C.LANE_COLORS[i];
      
      this.add.text(x, 55, C.LANE_NAMES[i], {
        fontFamily: 'Georgia, serif',
        fontSize: '28px',
        color: color
      }).setOrigin(0.5);
      
      this.add.text(x, 85, C.LANE_NAMES_EN[i], {
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: color
      }).setOrigin(0.5).setAlpha(0.6);
    }
  }

  createHitZone() {
    const hitZone = this.add.graphics();
    hitZone.fillStyle(C.COLORS.HIT_ZONE, 0.6);
    hitZone.fillRect(0, C.HIT_ZONE_Y - C.HIT_ZONE_HEIGHT / 2, C.GAME_WIDTH, C.HIT_ZONE_HEIGHT);
    hitZone.lineStyle(4, C.COLORS.HIT_ZONE_GLOW, 0.8);
    hitZone.lineBetween(0, C.HIT_ZONE_Y, C.GAME_WIDTH, C.HIT_ZONE_Y);
    
    for (let i = 0; i < C.LANE_COUNT; i++) {
      const x = i * C.LANE_WIDTH + C.LANE_WIDTH / 2;
      const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[i]).color;
      
      const ring = this.add.circle(x, C.HIT_ZONE_Y, C.NOTE_RADIUS + 8, 0x000000, 0);
      ring.setStrokeStyle(3, color, 0.4);
      this.add.circle(x, C.HIT_ZONE_Y, C.NOTE_RADIUS, color, 0.15);
    }
  }

  createUI() {
    this.add.text(C.GAME_WIDTH - 25, 30, '分數', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#888888'
    }).setOrigin(1, 0);
    
    this.scoreText = this.add.text(C.GAME_WIDTH - 25, 50, '0', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '36px',
      color: '#ffd93d'
    }).setOrigin(1, 0);
    
    this.comboText = this.add.text(C.GAME_WIDTH / 2, C.GAME_HEIGHT - 60, '', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '28px',
      color: '#00d4aa'
    }).setOrigin(0.5);
    
    this.timerText = this.add.text(25, 50, C.GAME_DURATION.toString(), {
      fontFamily: C.FONT_FAMILY,
      fontSize: '28px',
      color: '#666666'
    });
    
    this.ratingText = this.add.text(C.GAME_WIDTH / 2, C.HIT_ZONE_Y - 100, '', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '32px',
      color: '#ff6b9d'
    }).setOrigin(0.5).setAlpha(0);
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      const lane = Math.floor(pointer.x / C.LANE_WIDTH);
      if (lane >= 0 && lane < C.LANE_COUNT) {
        this.checkHit(lane);
        this.flashLane(lane);
      }
    });
    
    this.input.keyboard.on('keydown-A', () => { this.checkHit(0); this.flashLane(0); });
    this.input.keyboard.on('keydown-S', () => { this.checkHit(1); this.flashLane(1); });
    this.input.keyboard.on('keydown-D', () => { this.checkHit(2); this.flashLane(2); });
    this.input.keyboard.on('keydown-J', () => { this.checkHit(0); this.flashLane(0); });
    this.input.keyboard.on('keydown-K', () => { this.checkHit(1); this.flashLane(1); });
    this.input.keyboard.on('keydown-L', () => { this.checkHit(2); this.flashLane(2); });
  }

  flashLane(lane) {
    const x = lane * C.LANE_WIDTH + C.LANE_WIDTH / 2;
    const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[lane]).color;
    
    const flash = this.add.circle(x, C.HIT_ZONE_Y, C.NOTE_RADIUS + 20, color, 0.4);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 150,
      onComplete: () => flash.destroy()
    });
  }

  getPattern() {
    // Different patterns based on phase
    const intro = [
      [0], [], [1], [],
      [2], [], [0], [],
    ];
    
    const main = [
      [0], [2], [1], [],
      [0], [], [1], [2],
      [2], [0], [1], [],
      [0, 2], [], [1], [],
    ];
    
    const intense = [
      [0], [1], [2], [0],
      [1], [2], [0, 1], [],
      [2], [0], [1, 2], [0],
      [0, 2], [1], [0], [1, 2],
    ];
    
    const outro = [
      [0, 1, 2], [], [], [],
      [0], [], [1], [],
      [2], [], [], [],
      [0, 1, 2], [], [], [],
    ];
    
    switch (this.phase) {
      case 0: return intro;
      case 1: return main;
      case 2: return intense;
      case 3: return outro;
      default: return main;
    }
  }

  startNoteSpawner() {
    this.spawnTimer = this.time.addEvent({
      delay: C.BEAT_MS / 2, // 8th notes
      callback: () => {
        const pattern = this.getPattern();
        const lanes = pattern[this.patternIndex % pattern.length];
        lanes.forEach(lane => this.spawnNote(lane));
        this.patternIndex++;
      },
      loop: true
    });
  }

  spawnNote(lane) {
    const x = lane * C.LANE_WIDTH + C.LANE_WIDTH / 2;
    const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[lane]).color;
    
    const glow = this.add.circle(x, C.SPAWN_Y, C.NOTE_RADIUS + 5, color, 0.3);
    const note = this.add.circle(x, C.SPAWN_Y, C.NOTE_RADIUS, color, 0.9);
    note.setStrokeStyle(2, 0xffffff, 0.6);
    
    note.setData('lane', lane);
    note.setData('hit', false);
    note.setData('glow', glow);
    
    this.notes.add(note);
  }

  checkHit(lane) {
    let closestNote = null;
    let closestDist = Infinity;
    
    this.notes.getChildren().forEach(note => {
      if (note.getData('lane') === lane && !note.getData('hit')) {
        const dist = Math.abs(note.y - C.HIT_ZONE_Y);
        if (dist < closestDist) {
          closestDist = dist;
          closestNote = note;
        }
      }
    });
    
    if (closestNote && closestDist < C.TIMING.MISS) {
      closestNote.setData('hit', true);
      
      let rating, points, color;
      if (closestDist < C.TIMING.PERFECT) {
        rating = '完美';
        points = C.SCORE.PERFECT;
        color = C.COLORS.PERFECT;
      } else if (closestDist < C.TIMING.GREAT) {
        rating = '太棒';
        points = C.SCORE.GREAT;
        color = C.COLORS.GREAT;
      } else {
        rating = '不错';
        points = C.SCORE.GOOD;
        color = C.COLORS.GOOD;
      }
      
      const comboBonus = Math.floor(points * gameState.combo * C.COMBO_MULTIPLIER);
      points += comboBonus;
      
      gameState.addHit(rating === '完美' ? 'PERFECT' : rating === '太棒' ? 'GREAT' : 'GOOD', points);
      addPoints(points); // Track points for Play.fun
      this.updateUI(rating, color);
      
      playLaneSound(lane);
      this.hitEffect(closestNote, color);
      
      const glow = closestNote.getData('glow');
      if (glow) glow.destroy();
      closestNote.destroy();
    } else {
      playLaneSound(lane);
    }
  }

  hitEffect(note, color) {
    const burst = this.add.circle(note.x, note.y, C.NOTE_RADIUS, color, 0.8);
    this.tweens.add({
      targets: burst,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => burst.destroy()
    });
  }

  updateUI(rating, color) {
    this.scoreText.setText(gameState.score.toString());
    
    if (gameState.combo > 1) {
      this.comboText.setText(`${gameState.combo}x 連擊`);
    } else {
      this.comboText.setText('');
    }
    
    this.ratingText.setText(rating);
    this.ratingText.setColor(Phaser.Display.Color.IntegerToColor(color).rgba);
    this.ratingText.setAlpha(1);
    this.ratingText.setScale(1.3);
    
    this.tweens.add({
      targets: this.ratingText,
      alpha: 0,
      scaleX: 1,
      scaleY: 1,
      y: C.HIT_ZONE_Y - 130,
      duration: 400,
      onComplete: () => {
        this.ratingText.y = C.HIT_ZONE_Y - 100;
      }
    });
  }

  update(time, delta) {
    // Update timer color as time runs out
    if (this.gameTime <= 10) {
      this.timerText.setColor('#ff6b9d');
    }
    
    this.notes.getChildren().forEach(note => {
      const glow = note.getData('glow');
      
      note.y += (C.NOTE_SPEED * delta) / 1000;
      if (glow) glow.y = note.y;
      
      if (note.y > C.HIT_ZONE_Y + C.TIMING.MISS && !note.getData('hit')) {
        note.setData('hit', true);
        gameState.addMiss();
        this.comboText.setText('');
        playMiss();
        
        note.setFillStyle(C.COLORS.MISS, 0.4);
        if (glow) glow.destroy();
        
        this.tweens.add({
          targets: note,
          alpha: 0,
          duration: 300,
          onComplete: () => note.destroy()
        });
      }
      
      if (note.y > C.GAME_HEIGHT + 50) {
        if (glow) glow.destroy();
        note.destroy();
      }
    });
  }

  endGame() {
    gameState.isPlaying = false;
    stopMusic();
    if (this.spawnTimer) this.spawnTimer.remove();
    
    // Brief pause then show results
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene');
    });
  }

  shutdown() {
    stopMusic();
    if (this.spawnTimer) this.spawnTimer.remove();
  }
}
