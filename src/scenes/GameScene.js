import Phaser from 'phaser';
import * as C from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { playLaneSound, playMiss } from '../audio/SoundManager.js';
import { startGameplayBGM, stopMusic } from '../audio/MusicManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.notes = null;
    this.spawnTimer = null;
    this.beatIndex = 0;
  }

  create() {
    gameState.reset();
    gameState.isPlaying = true;
    
    this.createBackground();
    this.createLanes();
    this.createHitZone();
    this.createUI();
    this.setupInput();
    
    // Note pool
    this.notes = this.add.group();
    
    // Start spawning notes
    this.startNoteSpawner();
    
    // Start subtle BGM
    startGameplayBGM();
    
    // Game timer (60 seconds)
    this.gameTime = 60;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTime--;
        this.timerText.setText(this.gameTime.toString());
        if (this.gameTime <= 0) {
          this.endGame();
        }
      },
      repeat: 59
    });
  }

  createBackground() {
    // Dark gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x1a0a2e, 1);
    bg.fillRect(0, 0, C.GAME_WIDTH, C.GAME_HEIGHT);
    
    // Lane separators
    for (let i = 1; i < C.LANE_COUNT; i++) {
      const x = i * C.LANE_WIDTH;
      const line = this.add.graphics();
      line.lineStyle(2, 0x2a2a3e, 0.5);
      line.lineBetween(x, 0, x, C.GAME_HEIGHT);
    }
  }

  createLanes() {
    // Lane labels at top
    for (let i = 0; i < C.LANE_COUNT; i++) {
      const x = i * C.LANE_WIDTH + C.LANE_WIDTH / 2;
      const color = C.LANE_COLORS[i];
      
      this.add.text(x, 30, C.LANE_NAMES[i], {
        fontFamily: C.FONT_FAMILY,
        fontSize: '14px',
        color: color
      }).setOrigin(0.5);
    }
  }

  createHitZone() {
    // Hit zone bar
    const hitZone = this.add.graphics();
    hitZone.fillStyle(C.COLORS.HIT_ZONE, 0.8);
    hitZone.fillRect(0, C.HIT_ZONE_Y - C.HIT_ZONE_HEIGHT / 2, C.GAME_WIDTH, C.HIT_ZONE_HEIGHT);
    
    // Glow line
    hitZone.lineStyle(3, C.COLORS.HIT_ZONE_GLOW, 1);
    hitZone.lineBetween(0, C.HIT_ZONE_Y, C.GAME_WIDTH, C.HIT_ZONE_Y);
    
    // Lane hit targets
    for (let i = 0; i < C.LANE_COUNT; i++) {
      const x = i * C.LANE_WIDTH + C.LANE_WIDTH / 2;
      const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[i]).color;
      
      const target = this.add.circle(x, C.HIT_ZONE_Y, C.NOTE_RADIUS + 5, color, 0.2);
      target.setStrokeStyle(2, color, 0.6);
    }
  }

  createUI() {
    // Score
    this.scoreText = this.add.text(20, C.GAME_HEIGHT - 50, '0', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '32px',
      color: '#ffffff'
    });
    
    // Combo
    this.comboText = this.add.text(C.GAME_WIDTH / 2, C.GAME_HEIGHT - 80, '', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '24px',
      color: '#ffcc00'
    }).setOrigin(0.5);
    
    // Timer
    this.timerText = this.add.text(C.GAME_WIDTH - 20, C.GAME_HEIGHT - 50, '60', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '32px',
      color: '#888888'
    }).setOrigin(1, 0);
    
    // Rating popup
    this.ratingText = this.add.text(C.GAME_WIDTH / 2, C.HIT_ZONE_Y - 80, '', {
      fontFamily: C.FONT_FAMILY,
      fontSize: '28px',
      color: '#00ff88'
    }).setOrigin(0.5).setAlpha(0);
  }

  setupInput() {
    // Touch/click input - detect which lane
    this.input.on('pointerdown', (pointer) => {
      const lane = Math.floor(pointer.x / C.LANE_WIDTH);
      if (lane >= 0 && lane < C.LANE_COUNT) {
        this.checkHit(lane);
      }
    });
    
    // Keyboard input
    this.input.keyboard.on('keydown-A', () => this.checkHit(0));
    this.input.keyboard.on('keydown-S', () => this.checkHit(1));
    this.input.keyboard.on('keydown-D', () => this.checkHit(2));
    this.input.keyboard.on('keydown-F', () => this.checkHit(3));
  }

  startNoteSpawner() {
    // Predefined pattern for 60 seconds at 120 BPM
    // Simple pattern that repeats
    const pattern = [
      [0], [2], [1], [2],           // kick hat snare hat
      [0], [2], [1, 3], [2],        // kick hat snare+synth hat
      [0], [2, 3], [1], [2],        // kick hat+synth snare hat
      [0, 3], [2], [1], [2, 3]      // kick+synth hat snare hat+synth
    ];
    
    let patternIndex = 0;
    
    this.spawnTimer = this.time.addEvent({
      delay: C.BEAT_MS / 2, // 8th notes at 120 BPM
      callback: () => {
        const lanes = pattern[patternIndex % pattern.length];
        lanes.forEach(lane => this.spawnNote(lane));
        patternIndex++;
      },
      loop: true
    });
  }

  spawnNote(lane) {
    const x = lane * C.LANE_WIDTH + C.LANE_WIDTH / 2;
    const color = Phaser.Display.Color.HexStringToColor(C.LANE_COLORS[lane]).color;
    
    const note = this.add.circle(x, C.SPAWN_Y, C.NOTE_RADIUS, color, 0.9);
    note.setStrokeStyle(3, 0xffffff, 0.8);
    note.setData('lane', lane);
    note.setData('hit', false);
    
    this.notes.add(note);
  }

  checkHit(lane) {
    // Find closest note in this lane
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
      // Hit!
      closestNote.setData('hit', true);
      
      let rating, points, color;
      if (closestDist < C.TIMING.PERFECT) {
        rating = 'PERFECT';
        points = C.SCORE.PERFECT;
        color = C.COLORS.PERFECT;
      } else if (closestDist < C.TIMING.GREAT) {
        rating = 'GREAT';
        points = C.SCORE.GREAT;
        color = C.COLORS.GREAT;
      } else if (closestDist < C.TIMING.GOOD) {
        rating = 'GOOD';
        points = C.SCORE.GOOD;
        color = C.COLORS.GOOD;
      } else {
        rating = 'GOOD';
        points = C.SCORE.GOOD;
        color = C.COLORS.GOOD;
      }
      
      // Apply combo bonus
      const comboBonus = Math.floor(points * gameState.combo * C.COMBO_MULTIPLIER);
      points += comboBonus;
      
      gameState.addHit(rating, points);
      this.updateUI(rating, color);
      
      // Play the sound
      playLaneSound(lane);
      
      // Visual feedback
      this.hitEffect(closestNote, color);
      
      // Remove note
      closestNote.destroy();
    } else {
      // Pressed but no note - still make sound but smaller
      playLaneSound(lane);
    }
  }

  hitEffect(note, color) {
    // Burst effect
    const burst = this.add.circle(note.x, note.y, C.NOTE_RADIUS, color, 0.8);
    this.tweens.add({
      targets: burst,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 200,
      onComplete: () => burst.destroy()
    });
  }

  updateUI(rating, color) {
    // Update score
    this.scoreText.setText(gameState.score.toString());
    
    // Update combo
    if (gameState.combo > 1) {
      this.comboText.setText(`${gameState.combo}x COMBO`);
    } else {
      this.comboText.setText('');
    }
    
    // Show rating
    this.ratingText.setText(rating);
    this.ratingText.setColor(Phaser.Display.Color.IntegerToColor(color).rgba);
    this.ratingText.setAlpha(1);
    this.ratingText.setScale(1.2);
    
    this.tweens.add({
      targets: this.ratingText,
      alpha: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 300
    });
  }

  update(time, delta) {
    // Move notes down
    this.notes.getChildren().forEach(note => {
      note.y += (C.NOTE_SPEED * delta) / 1000;
      
      // Check for miss
      if (note.y > C.HIT_ZONE_Y + C.TIMING.MISS && !note.getData('hit')) {
        note.setData('hit', true);
        gameState.addMiss();
        this.comboText.setText('');
        playMiss();
        
        // Miss effect
        note.setFillStyle(C.COLORS.MISS, 0.5);
        this.tweens.add({
          targets: note,
          alpha: 0,
          duration: 200,
          onComplete: () => note.destroy()
        });
      }
      
      // Remove off-screen notes
      if (note.y > C.GAME_HEIGHT + 50) {
        note.destroy();
      }
    });
  }

  endGame() {
    gameState.isPlaying = false;
    stopMusic();
    if (this.spawnTimer) this.spawnTimer.remove();
    this.scene.start('GameOverScene');
  }

  shutdown() {
    stopMusic();
    if (this.spawnTimer) this.spawnTimer.remove();
  }
}
