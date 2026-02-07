# Assets Folder

This folder is reserved for game assets like images and sounds.

Currently, the game uses:
- **Vector graphics** - All graphics are drawn with Canvas API (no image files needed)
- **Synthesized audio** - All sounds are generated with Web Audio API (no audio files needed)

## Future Asset Candidates

If you want to enhance the game in the future, you could add:

### Images
- `detective-gulls.png` - Sprite sheet for Detective Gulls character
- `pedestrian.png` - Sprite sheet for pedestrian variations
- `background.png` - Street background texture
- `particles.png` - Particle effect sprites

### Sounds
- `poop-fire.wav` - Poop firing sound
- `hit-target.wav` - Target hit sound
- `take-damage.wav` - Damage sound
- `level-up.wav` - Level complete sound
- `ambience.wav` - Background street noise

### Data
- `levels.json` - Level configurations
- `config.json` - Game configuration

## Current Implementation

All graphics and audio are **self-contained in JavaScript**:
- **Graphics:** Canvas 2D API with vector shapes
- **Audio:** Web Audio API with synthesized tones

## Adding Assets

To add images or sounds in the future:

1. Create files in this directory
2. Load them in your HTML/JavaScript
3. Reference them in renderer.js or audio.js
4. Update documentation

Example:
```javascript
// Load image
const image = new Image();
image.src = 'assets/detective-gulls.png';
image.onload = () => {
  // Draw sprite
  ctx.drawImage(image, x, y);
};

// Load audio
const audio = new Audio('assets/poop-fire.wav');
audio.play();
```

Keep this folder clean and organized for future contributors!
