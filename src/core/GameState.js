export const gameState = {
  score: 0,
  combo: 0,
  maxCombo: 0,
  perfectCount: 0,
  greatCount: 0,
  goodCount: 0,
  missCount: 0,
  isPlaying: false,
  
  reset() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.perfectCount = 0;
    this.greatCount = 0;
    this.goodCount = 0;
    this.missCount = 0;
    this.isPlaying = false;
  },
  
  addHit(rating, points) {
    this.score += points;
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    
    if (rating === 'PERFECT') this.perfectCount++;
    else if (rating === 'GREAT') this.greatCount++;
    else if (rating === 'GOOD') this.goodCount++;
  },
  
  addMiss() {
    this.combo = 0;
    this.missCount++;
  },
  
  getTotalNotes() {
    return this.perfectCount + this.greatCount + this.goodCount + this.missCount;
  },
  
  getAccuracy() {
    const total = this.getTotalNotes();
    if (total === 0) return 100;
    const weighted = (this.perfectCount * 100 + this.greatCount * 75 + this.goodCount * 50) / total;
    return Math.round(weighted);
  }
};
