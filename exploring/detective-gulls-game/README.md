# Detective Gulls: The Game

A hilarious arcade-style web game where you control Detective Gulls, a fedora-wearing seagull with a trenchcoat, to poop on unsuspecting pedestrians walking the streets below!

## Game Overview

**Detective Gulls** is a fast-paced arcade game built with vanilla JavaScript and HTML5 Canvas. Control the quirky seagull detective with your mouse, time your poops to hit pedestrians, and rack up points while dodging the rocks and beer bottles they throw back at you!

### Features
- 🎮 **20 Progressive Levels** - Difficulty increases with more pedestrians, faster movement, and deadlier projectiles
- 🖱️ **Mouse-Based Controls** - Hover to aim, click to fire rapid-poop sequences
- 💨 **Physics-Based Gameplay** - Gravity, collision detection, and realistic projectile behavior
- 🎨 **Vector Graphics** - Clean, simple, responsive canvas-based graphics
- 🔊 **Sound Effects** - Audio feedback for hits, misses, and level progression
- 📱 **Responsive Design** - Plays smoothly on desktop and mobile devices
- 📊 **Score Tracking** - Keep high scores to write down and share with friends

## How to Play

1. **Open `index.html`** in your web browser (no build process needed!)
2. **Move your mouse** to control Detective Gulls' position (upper 50% of screen)
3. **Click and hold** to rapid-fire poop at pedestrians below
4. **Collect flying cigarette packs** for health restoration
5. **Dodge incoming rocks and beer bottles** thrown by angry pedestrians
6. **Survive 60 seconds** per level to advance to the next
7. **Reach level 20** for maximum bragging rights!

### Controls
- **Mouse Position**: Control Detective Gulls' flight
- **Left Click**: Fire poop (hold to rapid-fire up to 5 shots)
- **Space**: Pause/Resume game
- **R**: Restart current level

## Game Mechanics

### Detective Gulls (Player)
- Lives: 3 (displayed as health indicator)
- Movement: Follows mouse cursor in the upper 50% of screen
- Attack: Rapid-fire poop with 5-shot magazine, 3-second full recharge (0.6s per shot)
- Special: Can collect cigarette packs for health recovery

### Pedestrians
- Walk horizontally across the street (bottom 33% of screen)
- Vary in speed
- Throw rocks/bottles at Detective when nearby
- Removed from game when hit by poop
- Award 100 points per successful hit

### Enemy Projectiles
- **Rocks** (small): -5 health, -20 points on hit
- **Beer Bottles** (large): -10 health, -50 points on hit
- Frequency and size increase with level difficulty

### Health Pickups
- **Cigarette Packs**: +2-3 health, appear randomly, disappear after 2.5 seconds
- Less frequent than other events but valuable for survival

## Technical Architecture

See `ARCHITECTURE.md` for detailed system design.

See `DESIGN.md` for visual design guidelines.

See `CONTRIBUTING.md` for contribution guidelines.

## Project Structure

```
detective-gulls-game/
├── index.html              # Main game container
├── css/
│   └── styles.css          # Game styling
├── js/
│   ├── main.js            # Entry point & game loop
│   ├── game.js            # Core game state manager
│   ├── player.js          # Detective Gulls logic
│   ├── pedestrian.js      # NPC behavior
│   ├── projectile.js      # Poop, rocks, bottles, pickups
│   ├── collision.js       # Collision detection
│   ├── renderer.js        # Canvas drawing
│   ├── input.js           # Mouse/keyboard handling
│   ├── ui.js              # HUD and scoreboard
│   └── audio.js           # Sound effects
├── assets/                # Game images and sounds
└── docs/                  # Documentation
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

No installation or build process required!

1. Clone or download the repository
2. Open `index.html` in your browser
3. Start pooping on pedestrians!

## Tips for Success

- **Lead your shots**: Anticipate where pedestrians will be
- **Manage ammo**: Use your 5-poop magazine wisely
- **Collect cigarettes**: Health pickups are rare and valuable
- **Watch for bottles**: Beer bottles are deadlier than rocks
- **Stay mobile**: Keep moving to avoid concentrated fire
- **Time your clicks**: Rapid-fire works best when pedestrians are close

## Scoring System

| Event | Points |
|-------|--------|
| Poop Hit on Pedestrian | +100 |
| Rock Hit (taken) | -20 |
| Beer Bottle Hit (taken) | -50 |
| Cigarette Pack Collected | +5 (via health) |
| Level Complete | +500 (bonus) |

## Difficulty Progression

Each level increases:
- Number of pedestrians on screen
- Pedestrian movement speed
- Frequency of projectile throws
- Size/damage of projectiles
- Spawn rate of health pickups decreases

By level 20, expect chaos!

## Future Enhancements

- Persistent high score storage (localStorage)
- Multiplayer/competitive modes
- Power-ups and special abilities
- Boss levels
- Custom difficulty settings
- Leaderboard system

## License

Created for fun and glory! Feel free to share with friends.

## Credits

Concept & Character: Detective Gulls  
Development: Vanilla JavaScript, HTML5 Canvas, Web Audio API

---

**Now go forth and poop on some pedestrians!** 💩
