// main.js - Game Loop Entry Point
// The heart of the game - 60 FPS game loop

let game = null;
let lastTime = 0;

/**
 * Main game loop - runs at 60 FPS
 * Handles: Update → Render → Input
 */
function gameLoop(currentTime) {
  if (lastTime === 0) lastTime = currentTime;
  
  const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
  lastTime = currentTime;
  
  // Cap deltaTime to prevent large jumps (tab loss, performance spike)
  const maxDelta = 0.1; // 100ms max per frame
  const clampedDelta = Math.min(deltaTime, maxDelta);
  
  // Update game state
  if (game.isRunning) {
    game.update(clampedDelta);
  }
  
  // Render everything
  game.render();
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

/**
 * Initialize and start the game
 */
function initGame() {
  console.log('Initializing Detective Gulls...');
  
  // Create game instance
  game = new Game();
  
  // Setup canvas
  game.initCanvas();
  
  // Setup input handlers
  game.setupInput();
  
  // Start first level
  game.startLevel(1);
  
  console.log('Game ready! Starting level 1...');
  
  // Begin game loop
  requestAnimationFrame(gameLoop);
}

/**
 * Handle page load
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready, starting game...');
  initGame();
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', () => {
  if (game) {
    console.log('Cleaning up...');
    game.cleanup();
  }
});

// Prevent context menu on game canvas
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'CANVAS') {
    e.preventDefault();
  }
});
