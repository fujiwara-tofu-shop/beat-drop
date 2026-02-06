// Play.fun SDK integration
// Non-blocking: if SDK fails to load, game still works

export function initPlayFun() {
  if (typeof OpenGameSDK === 'undefined') {
    console.log('[PlayFun] SDK not loaded, skipping');
    return null;
  }

  try {
    const sdk = new OpenGameSDK();
    sdk.initialize();
    console.log('[PlayFun] Initialized');
    
    return {
      addPoints: (points) => {
        try {
          sdk.submitScore(points);
          console.log('[PlayFun] Submitted score:', points);
        } catch (e) {
          console.warn('[PlayFun] Score submit failed:', e);
        }
      },
      gameOver: () => {
        try {
          sdk.gameOver();
        } catch (e) {
          console.warn('[PlayFun] Game over failed:', e);
        }
      }
    };
  } catch (e) {
    console.warn('[PlayFun] Init failed:', e);
    return null;
  }
}

// Auto-init when module loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (window.game) {
      window.game.playFun = initPlayFun();
    }
  });
}
