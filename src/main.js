import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './core/Constants.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { initPlayFun } from './playfun.js';

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0a0a0f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    min: {
      width: 270,
      height: 480
    },
    max: {
      width: 1080,
      height: 1920
    }
  },
  input: {
    activePointers: 3
  },
  scene: [MenuScene, GameScene, GameOverScene]
};

// Initialize Play.fun SDK, then start game
initPlayFun(() => {
  console.log('[Game] Starting Phaser');
  window.game = new Phaser.Game(config);
});
