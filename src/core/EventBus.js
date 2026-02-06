import Phaser from 'phaser';

export const Events = {
  // Audio
  AUDIO_INIT: 'audio:init',
  PLAY_SOUND: 'audio:play',
  
  // Game
  NOTE_HIT: 'note:hit',
  NOTE_MISS: 'note:miss',
  COMBO_UPDATE: 'combo:update',
  SCORE_UPDATE: 'score:update',
  GAME_OVER: 'game:over',
  GAME_START: 'game:start',
  GAME_RESTART: 'game:restart'
};

export const eventBus = new Phaser.Events.EventEmitter();
