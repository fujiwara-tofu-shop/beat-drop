// Play.fun SDK integration
// Uses OpenGameSDK from CDN loaded in index.html

let sdk = null;
let initialized = false;
let gameId = null;
let sessionPoints = 0;
let bestScore = 0;

export function initPlayFun(onReady) {
  if (typeof OpenGameSDK === 'undefined') {
    console.log('[PlayFun] SDK not loaded, skipping');
    if (onReady) onReady();
    return;
  }

  try {
    sdk = new OpenGameSDK({
      ui: { 
        usePointsWidget: true,
        theme: 'dark'
      },
      logLevel: 1 // errors only
    });

    sdk.on('OnReady', async () => {
      console.log('[PlayFun] SDK ready');
      initialized = true;
      
      // Get player's best score if logged in
      try {
        const points = await sdk.getPoints();
        if (points?.points) {
          bestScore = Number(points.points);
          console.log('[PlayFun] Best score:', bestScore);
        }
      } catch (e) {
        // Not logged in yet, that's fine
      }
      
      if (onReady) onReady();
    });

    sdk.on('LoginSuccess', async () => {
      console.log('[PlayFun] Logged in as:', sdk.playerId);
      // Refresh best score after login
      try {
        const points = await sdk.getPoints();
        if (points?.points) {
          bestScore = Number(points.points);
        }
      } catch (e) {}
    });

    sdk.on('SavePointsSuccess', () => {
      console.log('[PlayFun] Points saved successfully');
    });

    sdk.on('SavePointsFailed', () => {
      console.warn('[PlayFun] Failed to save points');
    });

    // Initialize with game ID (will be set after registration)
    // For now, init without gameId - we'll set it after registration
    sdk.init({ gameId: gameId || undefined });
    
  } catch (e) {
    console.warn('[PlayFun] Init failed:', e);
    if (onReady) onReady();
  }
}

// Call during gameplay as points are earned
export function addPoints(amount) {
  if (!sdk || !initialized) return;
  
  sessionPoints += amount;
  
  try {
    sdk.addPoints(amount);
  } catch (e) {
    console.warn('[PlayFun] addPoints failed:', e);
  }
}

// Call at end of game session to flush points to server
export async function savePoints() {
  if (!sdk || !initialized) {
    console.log('[PlayFun] SDK not ready, cannot save');
    return false;
  }

  try {
    console.log('[PlayFun] Saving session points:', sessionPoints);
    await sdk.savePoints();
    return true;
  } catch (e) {
    console.warn('[PlayFun] Save failed:', e);
    return false;
  }
}

// Reset session points (call at start of new game)
export function resetSession() {
  sessionPoints = 0;
}

// Get current session points
export function getSessionPoints() {
  return sessionPoints;
}

// Set game ID after registration
export function setGameId(id) {
  gameId = id;
  if (sdk && !initialized) {
    sdk.init({ gameId: id });
  }
}

// Expose for debugging
window.playFunSDK = {
  addPoints,
  savePoints,
  resetSession,
  getSessionPoints,
  setGameId,
  get initialized() { return initialized; },
  get bestScore() { return bestScore; }
};
