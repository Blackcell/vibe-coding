# Contributing to Detective Gulls

Thank you for your interest in contributing! This guide will help you understand the codebase and make meaningful contributions.

## Code of Conduct

- Be respectful and inclusive
- Keep discussions focused on the project
- Report issues constructively
- Embrace the humor and spirit of the game

## Getting Started

### Prerequisites

- A modern web browser
- A text editor (VS Code recommended)
- Basic understanding of JavaScript, HTML, and Canvas API
- No build tools or npm needed!

### Setup

1. Clone or download the repository
2. Open `index.html` in your browser to test
3. Edit files in `js/`, `css/`, and `assets/` folders
4. Reload browser to see changes (no build step!)

## Project Structure Quick Reference

```
js/
├── main.js          → Game loop entry point
├── game.js          → Core game state (MODIFY HERE FOR LOGIC)
├── player.js        → Detective Gulls behavior
├── pedestrian.js    → NPC behavior
├── projectile.js    → All projectiles and pickups
├── collision.js     → Collision detection
├── renderer.js      → Canvas drawing functions
├── input.js         → Mouse/keyboard handling
├── ui.js            → HUD and menus
└── audio.js         → Sound effects

css/
└── styles.css       → Styling and layout

assets/
└── detectivegulls.jpg → Character reference image
```

## Common Tasks

### Adding a New Sound Effect

**File**: `js/audio.js`

1. Find the `AudioManager` class
2. Add a new method following the pattern:

```javascript
playNewSound() {
  const audioCtx = this.getAudioContext();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  oscillator.frequency.value = 800; // Hz
  oscillator.type = 'sine';
  
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.5);
}
```

3. Call it from game logic: `this.audioManager.playNewSound()`
4. Test in browser

### Adjusting Level Difficulty

**File**: `js/game.js`

Find the `getLevelConfig()` method. Adjust these parameters:

```javascript
pedestrianCount: 2 + Math.floor(levelProgress * 8),  // More enemies
pedestrianSpeed: 1 + levelProgress * 2,              // Faster movement
projectileFrequency: 0.3 + levelProgress * 0.7,      // More throws
bottleRatio: levelProgress * 0.7,                    // % bottles vs rocks
pickupFrequency: Math.max(0.02 - levelProgress * 0.01, 0.005) // Health packs
```

### Changing Colors

**File**: `js/renderer.js` and `css/styles.css`

Find color constants at the top of `renderer.js`:

```javascript
const COLORS = {
  DETECTIVE_BODY: '#FFD700',
  DETECTIVE_COAT: '#8B4513',
  POOP: '#8B4513',
  // ... etc
};
```

Modify hex values to change appearance.

### Adjusting Physics

**File**: `js/projectile.js` and `js/player.js`

Key constants to modify:

```javascript
GRAVITY = 600;              // Pixel/s² - affects projectile fall speed
POOP_RECHARGE = 0.6;        // Seconds between poops
MAX_AMMO = 5;               // Shots per magazine
DETECTIVE_SPEED = 300;      // Pixel/s - Detective movement speed
```

### Adding New Projectile Type

**File**: `js/projectile.js`

1. Create new class extending `Projectile`
2. Override `draw()` method with your graphics
3. Add to `ProjectileFactory.create()` method
4. Update collision logic in `game.js`

Example:

```javascript
class Mine extends Projectile {
  constructor(x, y) {
    super(x, y, 0, 2, 14, 14);
    this.type = 'mine';
    this.damage = 15;
  }
  
  draw(ctx) {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
    ctx.fill();
    // Draw spikes
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + Math.cos(angle) * 8,
        this.y + Math.sin(angle) * 8
      );
    }
    ctx.stroke();
  }
}
```

### Modifying Detective Appearance

**File**: `js/renderer.js`

Find `drawDetective()` function. The shape is drawn with canvas commands:

```javascript
drawDetective(ctx, x, y, health) {
  // Body
  ctx.fillStyle = COLORS.DETECTIVE_BODY;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // Add your modifications here
  // Draw wings, hat, accessories, etc.
}
```

### Adding UI Elements

**File**: `js/ui.js`

Find `drawHUD()` function and add drawing calls:

```javascript
drawHUD(ctx, gameState) {
  // Existing code...
  
  // Your new element
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Your Text', 10, 100);
}
```

## Testing

### Manual Testing

1. Open `index.html` in browser
2. Test your feature
3. Check all levels (1-20) work correctly
4. Test edge cases (extreme scores, rapid clicking, etc.)

### Browser Compatibility

Test in:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

### Performance

- Game should run at 60 FPS on mid-range devices
- No freezing or stuttering
- Check DevTools → Performance tab for bottlenecks

## Code Style Guidelines

### Naming Conventions

```javascript
// Constants (UPPER_SNAKE_CASE)
const GRAVITY = 600;
const MAX_ENTITIES = 100;

// Classes (PascalCase)
class Pedestrian { }
class ProjectileFactory { }

// Functions & Methods (camelCase)
function getCollisionBounds() { }
player.takeDamage(damage);

// Variables (camelCase)
let currentLevel = 1;
const playerHealth = 3;
```

### Comments

```javascript
// Use comments for WHY, not WHAT

// Good: Explains the reasoning
// Use margin of error for poop collision since pixels are discrete
const COLLISION_MARGIN = 2;

// Bad: Obvious from code
// Set collision margin to 2
const COLLISION_MARGIN = 2;
```

### Functions

Keep functions focused and under 50 lines when possible:

```javascript
// Good: Clear purpose, single responsibility
function calculateDamage(projectileType) {
  return projectileType === 'bottle' ? 10 : 5;
}

// Avoid: Too many responsibilities
function handleProjectileCollision(proj, target) {
  // ... 200 lines of different logic
}
```

### Performance Considerations

- Avoid creating objects in loops (pre-allocate if possible)
- Use `const`/`let` appropriately (not `var`)
- Batch canvas drawing calls when possible
- Cache frequently accessed values

## Debugging Tips

### Browser DevTools

```javascript
// Add temporary logging
console.log('Detective position:', player.x, player.y);

// Pause execution
debugger;

// Check entity state
console.table(game.pedestrians);
```

### Visual Debugging

Enable in `renderer.js`:

```javascript
drawDebug(ctx) {
  // Draw collision boxes
  ctx.strokeStyle = 'red';
  game.pedestrians.forEach(p => {
    ctx.strokeRect(p.x - p.width/2, p.y - p.height/2, p.width, p.height);
  });
}
```

### Check Game State

In console:
```javascript
game.score       // Current score
game.lives       // Current lives
game.level       // Current level
game.pedestrians // Array of all pedestrians
game.projectiles // Array of all projectiles
```

## Submitting Changes

1. **Test thoroughly** - Manual testing across levels
2. **Check for bugs** - No errors in console
3. **Keep it focused** - One feature per change
4. **Document changes** - Update relevant `.md` files
5. **Clean code** - Follow style guidelines
6. **Submit** - Share changes or create pull request

## Review Checklist

- [ ] Code follows style guidelines
- [ ] No console errors or warnings
- [ ] Game runs at 60 FPS
- [ ] All 20 levels work correctly
- [ ] Feature is tested on multiple browsers
- [ ] Documentation is updated
- [ ] Comments explain complex logic

## Ideas for Contributions

### Easy
- [ ] New sound effects
- [ ] Adjust colors/visual styling
- [ ] Add new UI text/messages
- [ ] Modify difficulty curve

### Medium
- [ ] New projectile types
- [ ] New power-ups
- [ ] Additional animations
- [ ] Level complete bonus mechanics

### Advanced
- [ ] New game modes (survival, endless)
- [ ] Local multiplayer (split screen)
- [ ] Persistent high score storage
- [ ] Replay system
- [ ] Level editor

## Common Issues

### Game Won't Start
- Check console for JavaScript errors
- Ensure all files are in correct directories
- Clear browser cache (Ctrl+Shift+Delete)
- Try different browser

### Collisions Not Working
- Check collision rectangles overlap correctly
- Verify entity bounds are set properly
- Add debug drawing to see collision boxes

### Performance Issues
- Profile with DevTools → Performance
- Reduce entity count in `getLevelConfig()`
- Check for memory leaks (console → Memory)
- Optimize draw calls

## Questions?

- Check `ARCHITECTURE.md` for system details
- Check `DESIGN.md` for design specifications
- Review similar code in the codebase
- Test in browser to understand behavior

## Thanks!

Your contributions make Detective Gulls better. Keep it fun, keep it funny, and keep those pedestrians dodging! 💩
