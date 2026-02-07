# Detective Gulls - Architecture Document

## System Overview

Detective Gulls is built on a modular entity-component architecture using vanilla JavaScript and HTML5 Canvas. The game uses a standard game loop pattern with separation of concerns between logic, rendering, and input handling.

## Core Systems

### 1. Game Loop (`main.js`)

The main game loop runs at **60 FPS** using `requestAnimationFrame`.

```
Update Phase → Render Phase → Input Phase → Repeat
```

- **Update**: Process all game logic (entity positions, collisions, timers)
- **Render**: Draw current game state to canvas
- **Input**: Process queued mouse/keyboard events

### 2. Game State Manager (`game.js`)

Central hub managing:
- Current level (1-20)
- Game state (playing, paused, game over, level complete)
- Time remaining in current level
- Score, high score, lives
- Collections of active entities (pedestrians, projectiles, pickups)

**Responsibilities:**
- Initialize levels with appropriate difficulty
- Spawn entities based on level difficulty
- Update all game entities
- Detect collisions
- Manage level transitions
- Track player health and score

### 3. Entity System

All game objects (Player, Pedestrians, Projectiles, Pickups) inherit from a base `Entity` class.

#### Base Entity Properties
```javascript
{
  x: number,           // Position X
  y: number,           // Position Y
  vx: number,          // Velocity X
  vy: number,          // Velocity Y
  width: number,       // Bounding box width
  height: number,      // Bounding box height
  active: boolean,     // Is entity in game?
  type: string         // 'player', 'pedestrian', 'poop', etc.
}
```

#### Entity Methods
- `update(deltaTime)` - Update position and state
- `draw(ctx)` - Render to canvas context
- `getBounds()` - Return collision rectangle
- `destroy()` - Remove from game

### 4. Player System (`player.js`)

**Detective Gulls Character**

Properties:
- `x, y` - Position (follows mouse, constrained to upper 50% of screen)
- `health` - Current lives (0-3)
- `poopAmmo` - Ammo in magazine (0-5)
- `poopRechargeTime` - Time until next poop available (0-3000ms)
- `lastPoopTime` - Timestamp of last poop fired
- `isMouseDown` - Track if holding click

Mechanics:
- **Mouse Following**: Smooth interpolation to mouse position, clamped to flight zone
- **Poop Firing**: 
  - Max 5 poops per magazine
  - 0.6 second recharge per poop
  - 3 second full recharge
  - Each click adds to ammo up to 5, triggers fire sequence
- **Damage**: Takes damage from rocks (-5) and bottles (-10)
- **Recovery**: Collecting cigarette packs restores health

### 5. Pedestrian System (`pedestrian.js`)

**NPCs walking the street**

Properties:
- `x, y` - Position (constrained to bottom 33% of street)
- `speed` - Horizontal movement speed (level-dependent)
- `direction` - Movement direction (1 or -1)
- `throwCooldown` - Time until next projectile
- `throwRate` - Frequency of throws (level-dependent)

Behaviors:
- Walk left/right across screen, wrapping at edges
- Detect Detective Gulls proximity (within throwRange)
- Throw rocks/bottles randomly when Detective is nearby
- Removed from game when hit by poop
- Visual indication when throwing (animation frame)

Level Scaling:
- **Level 1-5**: 2-3 pedestrians, slow speed, rocks only
- **Level 6-12**: 4-6 pedestrians, medium speed, mostly rocks, some bottles
- **Level 13-20**: 6-10 pedestrians, fast speed, frequent throws, mostly bottles

### 6. Projectile System (`projectile.js`)

Handles three types of projectiles plus pickups:

#### Poop (Player Attack)
- Falls straight down from Detective's X position
- Simple gravity physics
- Collides with pedestrians for removal
- Despawns after reaching ground level

#### Rocks (Enemy Small Projectile)
- Thrown by pedestrians
- Arc trajectory (gravity + initial velocity)
- Deals 5 damage on hit
- Bounces slightly on ground before despawning

#### Beer Bottles (Enemy Large Projectile)
- Thrown by pedestrians (levels 6+)
- Similar arc to rocks but larger
- Deals 10 damage on hit
- Larger visual size, slower (more weight)

#### Cigarette Packs (Health Pickups)
- Float upward with slow bobbing animation
- Despawn after 2.5 seconds
- Restore 2-3 health on collection
- Spawn randomly, less frequent than enemies

### 7. Collision System (`collision.js`)

**Axis-Aligned Bounding Box (AABB) Detection**

Functions:
- `checkCollision(rect1, rect2)` - Returns boolean if rectangles overlap
- `getCollisionOverlap(rect1, rect2)` - Returns overlap amount and direction
- `detectEntityCollisions(entities)` - Batch collision checks with callbacks

Collision Pairs:
- Poop + Pedestrian → Remove pedestrian, add score
- Rock/Bottle + Detective → Reduce health, subtract points
- Cigarette Pack + Detective → Restore health

### 8. Renderer System (`renderer.js`)

**Canvas-based drawing using vector graphics**

Functions:
- `initCanvas()` - Setup canvas and context
- `clear()` - Clear frame
- `drawDetective(x, y, health)` - Draw seagull with fedora, trenchcoat, eye patch
- `drawPedestrian(x, y, direction)` - Draw simple walking figure
- `drawPoop(x, y)` - Draw brown circle/splat
- `drawRock(x, y, size)` - Draw gray rock
- `drawBottle(x, y)` - Draw brown bottle shape
- `drawCigarettePack(x, y)` - Draw red cigarette pack
- `drawUI(score, lives, level, time)` - Draw scoreboard
- `drawPauseScreen()` - Pause overlay
- `drawGameOverScreen(finalScore, highScore)` - Game over screen

Canvas Size:
- Responsive: Takes up 90% of viewport width, maintains 16:9 aspect ratio
- Minimum: 800x450, Maximum: 1920x1080

### 9. Input System (`input.js`)

**Mouse and Keyboard Event Handling**

Mouse Events:
- `mousemove` - Track cursor position for Detective movement
- `mousedown` - Start poop firing sequence
- `mouseup` - Stop firing
- `click` - Single poop shots

Keyboard Events:
- `Space` - Pause/Resume
- `R` - Restart level
- `Esc` - Return to menu (if implemented)

Input queue system prevents missed events during high-frequency updates.

### 10. UI System (`ui.js`)

**Head-Up Display (HUD) and Menus**

HUD Elements:
- Score (top-left)
- Lives indicator (top-right, visual hearts)
- Level indicator (center-top)
- Time remaining (center-top, countdown)
- Ammo indicator (bottom-right, 5-shot bar)
- Recharge indicator (visual feedback)

Screens:
- **Title Screen**: Show high score, controls, start game
- **Pause Screen**: Show score, level, resume/restart options
- **Game Over Screen**: Show final score, high score, restart option
- **Level Complete**: Brief transition screen, show bonus points

### 11. Audio System (`audio.js`)

**Web Audio API for sound effects (no external libraries)**

Sound Effects:
- `poopFire()` - Poop shooting sound
- `hitTarget()` - Successful poop hit
- `takeDamage()` - Getting hit by projectile
- `collectPickup()` - Grabbing cigarette pack
- `levelUp()` - Advancing to next level
- `gameOver()` - Game over sound
- `ambience()` - Continuous street ambience

Implementation:
- Generate sine/square/noise waves programmatically
- Use OscillatorNode for tones
- GainNode for volume control
- Envelope for attack/decay

## Data Flow

```
Input Handler
    ↓
Game State Manager ← Update Commands
    ├─ Update Entities
    ├─ Detect Collisions
    ├─ Update Score/Time
    └─ Check Win/Lose Conditions
    ↓
Renderer
    ├─ Draw Game World
    ├─ Draw UI
    └─ Present to Canvas
    ↓
Audio System (triggers on events)
```

## Level Progression Algorithm

```javascript
// Pseudo-code for difficulty scaling
function getLevel(levelNumber) {
  const progress = (levelNumber - 1) / 19; // 0 to 1
  
  return {
    pedestrianCount: 2 + Math.floor(progress * 8),
    pedestrianSpeed: 1 + progress * 2,
    projectileFrequency: 0.3 + progress * 0.7,
    bottleRatio: progress * 0.7, // 0% to 70% are bottles
    pickupFrequency: Math.max(0.02 - progress * 0.01, 0.005)
  };
}
```

## Physics Model

### Gravity
- Applied to all vertical projectiles: `vy += gravity * deltaTime`
- Gravity constant: ~600 pixels/second²

### Collision Response
- Pedestrians: Destroyed when hit by poop
- Detective: Knockback effect when hit (small velocity change)
- Projectiles: Simple removal on collision (no bouncing for most)

## Performance Considerations

- **Entity Pooling**: Pre-allocate projectile objects, reuse instead of creating new
- **Spatial Partitioning**: Could implement grid-based collision checks for large entity counts
- **Draw Call Batching**: Group similar entities, draw in batches
- **Delta Time**: Use deltaTime for framerate-independent movement

Current Target: 60 FPS on modern hardware with 50+ entities

## Extensibility Points

1. **New Entity Types**: Extend base Entity class
2. **New Projectiles**: Add to ProjectileFactory
3. **New Levels**: Adjust difficulty scaling function
4. **New Audio**: Add methods to AudioManager
5. **UI Customization**: Modify renderer draw calls
6. **Power-ups**: Add new pickup types in future

## Known Limitations

- Single-player only (multiplayer would require significant refactoring)
- No persistent storage (high scores not saved between sessions)
- No mobile touch support (mouse-only in current version)
- Collision detection uses simple AABB (no pixel-perfect)
- Audio generated programmatically (can sound synthetic)

## Future Architecture Changes

1. Add entity component system (ECS) for better flexibility
2. Implement proper sprite system with image assets
3. Add particle system for visual effects
4. Network support for online multiplayer
5. Save game state to localStorage
6. Implement level editor
