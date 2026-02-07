# Detective Gulls - Quick Start Guide

Welcome to Detective Gulls! This guide will get you up and running in seconds.

## Getting Started (Super Fast!)

1. **Open `index.html`** in your web browser
   - No server needed
   - No build process
   - No npm install
   - Just open the file and play!

2. **Start playing immediately**
   - Game launches on page load
   - Level 1 begins automatically

## Game Controls

| Control | Action |
|---------|--------|
| **Mouse Position** | Move Detective Gulls around |
| **Left Click** | Fire poop (hold to rapid-fire) |
| **Space** | Pause/Resume game |
| **R** | Restart current level |

## How to Play

1. **Control Detective Gulls** by moving your mouse
2. **Click to poop** on pedestrians walking below
3. **Hold click** to rapid-fire up to 5 poops (3-second recharge)
4. **Avoid rocks and bottles** thrown by angry pedestrians
5. **Collect cigarette packs** for health restoration
6. **Survive 60 seconds** to advance to the next level
7. **Reach level 20** for maximum bragging rights!

## Game Mechanics

- **3 Lives**: Red hearts show your health
- **Score**: Points for hitting pedestrians (+100)
- **Ammo**: 5-shot magazine with 3-second recharge
- **Damage**: Rocks (-5 health), Bottles (-10 health)
- **Pickups**: Cigarette packs (+2-3 health)
- **20 Levels**: Each level gets progressively harder

## Difficulty Progression

Each level increases:
- Number of pedestrians
- Movement speed
- Projectile frequency
- Projectile types (more bottles at higher levels)
- Intensity and chaos

## Tips for Success

✅ **Lead your shots** - Aim where pedestrians will be  
✅ **Manage ammo** - Use your 5 poops wisely  
✅ **Collect pickups** - Health is rare and valuable  
✅ **Watch for bottles** - They're deadlier than rocks  
✅ **Stay mobile** - Keep moving to dodge attacks  

## File Structure

```
detective-gulls-game/
├── index.html              ← Open this to play!
├── css/styles.css         ← Game styling
├── js/
│   ├── main.js           ← Game loop
│   ├── game.js           ← Core game logic
│   ├── player.js         ← Detective Gulls
│   ├── pedestrian.js     ← NPCs
│   ├── projectile.js     ← Poop, rocks, bottles, pickups
│   ├── collision.js      ← Collision detection
│   ├── renderer.js       ← Canvas drawing
│   ├── input.js          ← Mouse/keyboard
│   ├── ui.js             ← HUD and menus
│   └── audio.js          ← Sound effects
├── README.md             ← Full documentation
├── ARCHITECTURE.md       ← System design
├── DESIGN.md            ← Visual design
├── CONTRIBUTING.md      ← How to contribute
├── DEVELOPMENT.md       ← Dev guide
└── QUICK_START.md       ← This file!
```

## Development

Want to modify the game? Check out:

- **DEVELOPMENT.md** - How to debug and make changes
- **ARCHITECTURE.md** - System design and how it works
- **DESIGN.md** - Visual design guidelines
- **CONTRIBUTING.md** - How to contribute improvements

### Quick Modifications

**Make level 5 easier:**
```javascript
// In js/game.js, find getLevelConfig()
// Reduce pedestrianCount or projectileFrequency for easier levels
```

**Add new sound:**
```javascript
// In js/audio.js, add a new method to AudioManager class
// Call it from game.js when appropriate
```

**Change colors:**
```javascript
// In js/renderer.js and js/player.js
// Modify hex color values like #FFD700
```

**Adjust physics:**
```javascript
// In js/projectile.js, modify:
GRAVITY = 600;      // Fall speed
POOP_COOLDOWN = 0.6; // Fire rate
```

## Troubleshooting

**Nothing appears?**
- Check browser console (F12)
- Ensure index.html and js/ folder are in same directory
- Try different browser

**No sound?**
- Browser may block audio
- Click on the game first (user interaction required)
- Check browser permissions

**Game is slow?**
- Check browser DevTools → Performance tab
- Game targets 60 FPS on modern hardware
- May run slower on low-end devices

**Controls not working?**
- Click on the game canvas first
- Try different browser
- Check console for errors (F12)

## Browser Support

✅ Chrome/Edge 60+  
✅ Firefox 55+  
✅ Safari 12+  
✅ Mobile browsers  

## High Scores

Your best score is saved in browser storage!

Want to write scores on paper for your friend? 📝
1. Play the game and beat your high score
2. Take a screenshot or write down the number
3. Share with friends and compete!

## Next Steps

- **Beat all 20 levels** for maximum glory
- **Improve your high score** and brag to friends
- **Contribute improvements** - see CONTRIBUTING.md
- **Customize the game** - see DEVELOPMENT.md

## Credits

- **Concept & Character:** Detective Gulls
- **Development:** Pure vanilla JavaScript + HTML5 Canvas
- **Audio:** Web Audio API (synthesized)
- **Inspiration:** Arcade games, dark humor, seagull chaos

---

**Now go forth and poop on some pedestrians!** 💩🎮

Have fun, and remember: *In Detective Gulls, the birds are the real menace!*
