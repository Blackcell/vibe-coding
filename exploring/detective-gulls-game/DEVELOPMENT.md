# Detective Gulls - Development Guide

## Quick Start

1. Open `index.html` in any modern web browser
2. No build process, no npm, no dependencies
3. Edit `.js` files and reload to see changes
4. Open browser DevTools (F12) to debug

## Development Workflow

### Making Changes

1. **Edit a file** in `js/`, `css/`, or `html`
2. **Save the file**
3. **Reload browser** (F5 or Cmd+R)
4. **See changes immediately**

That's it! No build step, no compilation, no waiting.

### Using Browser DevTools

**Open**: F12 (Windows/Linux) or Cmd+Option+I (Mac)

**Console Tab** - Debug and test code:
```javascript
// Check current game state
console.log(game);

// Test player movement
player.x = 100; player.y = 50;

// Check entities
console.table(game.pedestrians);
console.table(game.projectiles);

// Spawn test entity
game.spawnPedestrian();

// Modify level
game.level = 10;

// Get current config
console.log(game.getLevelConfig(game.level));
```

**Sources Tab** - Set breakpoints:
- Click line number to add breakpoint
- Use `debugger;` statement in code
- Step through code execution
- Watch variables

**Network Tab** - Check file loading (should all be fast local loads)

**Performance Tab** - Check FPS and bottlenecks:
- Click record, play game for 5 seconds, stop
- Look for dropped frames (red)
- Identify slow functions

### Project Files Overview

#### `index.html`
- Main HTML document
- Single canvas element for game
- Loads all JavaScript files in order
- Minimal styling (responsive container)

#### `css/styles.css`
- Canvas container styling
- Responsive design rules
- Body/page styles

#### `js/main.js`
- **Entry point** - starts everything
- Game loop using `requestAnimationFrame`
- Calls update, render, input each frame
- Currently running? Check here.

#### `js/game.js`
- **Core state manager** - tracks everything
- Current level, score, time, health
- Entity arrays (pedestrians, projectiles, etc.)
- Level configuration
- Spawning logic
- Win/lose conditions

#### `js/player.js`
- **Detective Gulls logic**
- Position tracking (follows mouse)
- Ammo/recharge system
- Poop firing mechanics
- Health management

#### `js/pedestrian.js`
- **NPC walking characters**
- Movement and wrapping
- Throwing logic (throwing rocks/bottles)
- Proximity detection for aiming

#### `js/projectile.js`
- **All flying/falling objects**
- Poop (player attack)
- Rocks (enemy projectile)
- Beer bottles (enemy projectile)
- Cigarette packs (health pickups)
- Physics and updates

#### `js/collision.js`
- **Collision detection**
- Simple AABB (bounding box) checks
- No physics response (handled elsewhere)

#### `js/renderer.js`
- **Canvas drawing**
- All visual elements drawn here
- Character sprites (vector graphics)
- UI elements
- Effects

#### `js/input.js`
- **Mouse and keyboard events**
- Tracks mouse position
- Mouse clicks for firing
- Pause/restart controls

#### `js/ui.js`
- **HUD and menu screens**
- Score display
- Lives indicator
- Level/time display
- Pause screen
- Game over screen

#### `js/audio.js`
- **Sound effects**
- Web Audio API
- Synth-generated sounds
- No external audio files

## Key Concepts

### Game Loop (60 FPS)

```
requestAnimationFrame(gameLoop)
  ↓
update(deltaTime) - Move entities, detect collisions, update state
  ↓
render() - Draw everything to canvas
  ↓
input - Handle any queued input
  ↓
repeat
```

**Important**: Always use `deltaTime` for frame-independent movement!

```javascript
// Good - works at any framerate
entity.x += entity.vx * deltaTime;

// Bad - framerate dependent
entity.x += entity.vx;
```

### Entity System

All game objects follow this pattern:

```javascript
class Entity {
  constructor(x, y, vx, vy, width, height) {
    this.x = x;           // Position
    this.y = y;
    this.vx = vx;         // Velocity
    this.vy = vy;
    this.width = width;   // Collision box
    this.height = height;
    this.active = true;   // Still in game?
    this.type = 'entity'; // For collision identification
  }

  update(deltaTime) {
    // Move entity
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  draw(ctx) {
    // Draw to canvas context
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      w: this.width,
      h: this.height
    };
  }

  destroy() {
    this.active = false;
  }
}
```

### Level Configuration

Levels 1-20 scale difficulty. See `game.js` → `getLevelConfig()`:

```javascript
function getLevelConfig(level) {
  const progress = (level - 1) / 19; // 0.0 to 1.0
  
  return {
    pedestrianCount: 2 + Math.floor(progress * 8),        // 2-10 enemies
    pedestrianSpeed: 1 + progress * 2,                     // 1-3x speed
    projectileFrequency: 0.3 + progress * 0.7,             // 30%-100% throw rate
    bottleRatio: progress * 0.7,                           // 0%-70% are bottles
    pickupFrequency: Math.max(0.02 - progress * 0.01, 0.005) // Rarer at high levels
  };
}
```

**To make level 5 easier**: Reduce `pedestrianCount` or `projectileFrequency`

### Collision Detection

Simple rectangle overlap check:

```javascript
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.w &&
         rect1.x + rect1.w > rect2.x &&
         rect1.y < rect2.y + rect2.h &&
         rect1.y + rect1.h > rect2.y;
}
```

**Each frame**, `game.js` checks all collision pairs:
- Poop vs Pedestrians (hit = kill pedestrian, +100 points)
- Rocks/Bottles vs Detective (hit = -health, -points)
- Pickups vs Detective (hit = +health)

### Poop Firing Mechanic

In `player.js`:

1. **Mouse down** → Add ammo (up to 5 max)
2. **Fire** → Create Poop projectile at Detective position
3. **Recharge** → Timer counts down at 0.6s per shot
4. **Full magazine** → 3 seconds to fully recharge

```javascript
// Simplified
update(deltaTime) {
  if (this.poopAmmo < 5) {
    this.poopRechargeTime -= deltaTime;
    if (this.poopRechargeTime <= 0) {
      this.poopAmmo++;
      this.poopRechargeTime = 600; // ms per shot
    }
  }
}

fire() {
  if (this.poopAmmo > 0) {
    game.spawnPoop(this.x, this.y);
    this.poopAmmo--;
  }
}
```

### Audio Generation

Web Audio API generates sounds without files:

```javascript
// Create oscillator (tone generator)
const oscillator = audioCtx.createOscillator();
oscillator.frequency.value = 800; // Hz
oscillator.type = 'sine';

// Control volume
const gain = audioCtx.createGain();
gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

// Connect and play
oscillator.connect(gain);
gain.connect(audioCtx.destination);
oscillator.start(audioCtx.currentTime);
oscillator.stop(audioCtx.currentTime + 0.3);
```

Useful frequencies:
- 200-400 Hz = Low, bass (sad trombone)
- 600-800 Hz = Mid, woody (poop sound)
- 1000-2000 Hz = High, bright (success ping)

## Common Development Tasks

### Test Level 15 Difficulty

```javascript
// In console
game.level = 15;
game.resetLevel();
```

Then check spawning/difficulty increase.

### Skip to Last Level

```javascript
// In console
game.level = 20;
game.resetLevel();
```

### Spawn Test Entities

```javascript
// Spawn 5 pedestrians
for (let i = 0; i < 5; i++) {
  game.spawnPedestrian();
}

// Spawn test rock
game.projectiles.push(new Rock(400, 100, 200, -150));

// Spawn test pickup
game.projectiles.push(new CigarettePack(300, 200));
```

### Adjust Sound Volume

```javascript
// In audio.js, modify master gain
const MASTER_VOLUME = 0.1; // 0.0 to 1.0
```

### Test High Score

```javascript
// In console
game.score = 9999;
game.lives = 0; // Game over
```

Then check high score display.

### Measure Performance

```javascript
// In console - measure frame time
let lastTime = performance.now();
setInterval(() => {
  const now = performance.now();
  const fps = 1000 / (now - lastTime);
  console.log('FPS:', fps.toFixed(1));
  lastTime = now;
}, 1000);
```

## Debugging Techniques

### Add Temporary Debug Drawing

In `renderer.js`:

```javascript
render() {
  // ... existing code ...
  
  // DEBUG: Draw collision boxes
  ctx.strokeStyle = 'red';
  game.pedestrians.forEach(p => {
    const bounds = p.getBounds();
    ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
  });
}
```

Then remove before committing.

### Log Entity State

```javascript
// In game.js update loop
console.log({
  time: this.timeRemaining,
  score: this.score,
  lives: this.lives,
  pedestrians: this.pedestrians.length,
  projectiles: this.projectiles.length,
  playerAmmo: this.player.poopAmmo
});
```

### Visual Feedback

Add temporary visual element:

```javascript
// In render - show ammo state
ctx.fillStyle = this.player.poopAmmo > 0 ? 'green' : 'red';
ctx.fillRect(0, 0, 50, 50);
```

### Break on Condition

```javascript
// In update loop
if (this.score < 0) {
  debugger; // Pause execution
}
```

## Performance Optimization

### Current Bottlenecks

1. **Collision checks** - O(n²) for n entities
   - Fix: Spatial partitioning (grid)
   - Current: Fine for <100 entities

2. **Canvas drawing** - Many small draw calls
   - Fix: Batch drawing, sprites
   - Current: Acceptable (vector graphics)

3. **Entity updates** - Loop through all entities
   - Fix: Object pooling
   - Current: Fine for typical gameplay

### Quick Optimizations

**Reduce collision checks:**
```javascript
// Only check active entities
const active = this.projectiles.filter(p => p.active);
```

**Cache canvas state:**
```javascript
ctx.save();
ctx.translate(x, y);
// ... draw relative to point
ctx.restore();
```

**Use requestAnimationFrame:**
Already done in `main.js` - uses browser's optimal frame rate.

## Browser Compatibility

### Supported APIs
- HTML5 Canvas (drawing)
- requestAnimationFrame (timing)
- Web Audio API (sound)
- localStorage (future: high scores)

### Tested On
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile
- iOS Safari 12+
- Chrome Mobile
- Firefox Mobile

## File Size & Performance

**Total code**: ~200KB (uncompressed)
- HTML: ~5KB
- CSS: ~2KB
- JavaScript: ~150KB
- Assets: ~40KB (image reference)

**Load time**: <1 second on 4G
**Memory usage**: ~50-100MB during gameplay
**FPS**: 60 FPS target (30+ on low-end devices)

## Next Steps for Learning

1. **Understand the loop**: Read `main.js` → trace through one frame
2. **Add a feature**: Implement in one file at a time
3. **Test thoroughly**: Use console to verify behavior
4. **Profile**: Use DevTools → Performance tab
5. **Optimize**: Only if bottlenecks exist

## Resources

- MDN Web Docs: Canvas API, Web Audio API
- requestAnimationFrame guide
- Game programming patterns
- JavaScript ES6 documentation

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Nothing renders | Check canvas size, check renderer.js |
| No sound | Check audio.js, check browser permissions |
| Slow/laggy | Profile with DevTools, reduce entity count |
| Controls not working | Check input.js event listeners |
| Collisions broken | Draw collision boxes, verify bounds |
| Crashes on level 20 | Check array bounds, look for null references |

---

**Happy developing!** 🎮 Remember to test often and keep it fun!
