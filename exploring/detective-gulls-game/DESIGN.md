# Detective Gulls - Design Document

## Visual Design

### Art Style

Clean, minimalist **vector graphics** drawn directly to canvas. The art style is:
- **Simple shapes**: Circles, rectangles, triangles, curves
- **Flat colors**: Limited palette for clarity and performance
- **Arcade aesthetic**: Bold outlines, high contrast
- **Responsive**: Scales smoothly to any screen size

### Color Palette

```
Background:     #87CEEB (Sky Blue)
Street:         #333333 (Dark Gray)
Detective:      #FFD700 (Gold - body)
                #8B4513 (Brown - coat)
                #000000 (Black - hat, eye)
Pedestrians:    #FF6B6B (Red shirts)
                #4ECDC4 (Teal pants)
Poop:           #8B4513 (Brown)
Rocks:          #A9A9A9 (Gray)
Bottles:        #8B7355 (Brown glass)
Cigarettes:     #FF4444 (Bright Red)
Health:         #00FF00 (Green)
Damage:         #FF0000 (Red)
```

### Character Design

#### Detective Gulls (Player Character)

**Visual Elements:**
- **Body**: Large circle, yellow/gold color (seagull body)
- **Head**: Circle with distinctive features
  - Fedora hat (black, angled)
  - Trenchcoat (brown outline)
  - Black eye patch (left eye)
  - Cigarette (thin line coming from mouth)
- **Wings**: Animated flapping
  - Small wing shapes on sides
  - Subtle up/down animation
- **Size**: ~40px diameter
- **Animation States**:
  - Idle flapping (standing still)
  - Flying (smooth movement)
  - Hit reaction (slight color flash, knockback)
  - Firing (brief visual feedback)

```
Visual Appearance (Front View, ~40x40px):
     ┌─────┐
     │ ◯▲◯ │  (fedora on top)
   ◯─│ ◮ • │─◯  (wings, eye patch, cigarette)
     │ ◯ ◯ │
     └─────┘
```

#### Pedestrians (Enemy NPCs)

**Visual Elements:**
- **Body**: Medium circle (20px diameter)
- **Head**: Smaller circle on top
- **Arms**: Small lines extending from body
- **Legs**: Two small line segments below
- **Colors**: Red shirt, teal pants (alternating among pedestrians)
- **Animation**: Simple walking motion
  - Legs swing side-to-side
  - Slight vertical bobbing
  - Direction indicator (facing left or right)
- **Throwing Animation**: Arms raise when throwing projectile

```
Walking Left       Walking Right
   ◯                  ◯
  ╱│╲                ╱│╲
  | |       vs       | |
 ╱  ╲                ╱  ╲
```

### Projectile Design

#### Poop (Player Attack)
- **Visual**: Small brown circle with slight splattering
- **Size**: 6-8px diameter
- **Trail**: Optional light brown dots showing path
- **Impact**: Brief explosion effect (small particles)
- **Color**: #8B4513 (brown)

#### Rocks (Small Enemy Projectile)
- **Visual**: Irregular gray shape (3-4 sided polygon)
- **Size**: 8-12px
- **Rotation**: Spins as it travels
- **Color**: #A9A9A9 (gray)
- **Impact**: Small bounce animation

#### Beer Bottles (Large Enemy Projectile)
- **Visual**: Brown bottle shape (rectangle with narrower neck)
- **Size**: 12-16px tall
- **Rotation**: Tumbles/rotates more obviously
- **Color**: #8B7355 (brown glass)
- **Impact**: Crash sound effect

#### Cigarette Packs (Pickups)
- **Visual**: Red rectangle with white details
- **Size**: 10-14px
- **Animation**: Gentle bobbing up/down, slight rotation
- **Color**: #FF4444 (red), #FFFFFF (white accents)
- **Particle Effect**: Green sparkles when collected
- **Glow**: Subtle pulsing effect to make it stand out

### UI Design

#### Scoreboard (Top HUD)

```
┌──────────────────────────────────────────────────────┐
│ Score: 2540        Level: 5    Time: 45s    ♥ ♥ ♥   │
└──────────────────────────────────────────────────────┘
```

Elements:
- **Score**: White text, top-left, updates in real-time
- **Level**: White text, top-center
- **Timer**: Red when <10 seconds, top-center
- **Lives**: Heart icons (♥), top-right
  - Full heart ♥ = 1 life
  - Empty heart ♡ = lost life
  - Color: Green → Yellow → Red as health decreases

#### Ammo Indicator (Bottom-Right HUD)

```
Ammo:
█████ (5 loaded)
████░ (4 loaded)
███░░ (3 loaded)
██░░░ (2 loaded)
█░░░░ (1 loaded)
░░░░░ (0 loaded - recharging)
```

- **Style**: 5 boxes representing magazine capacity
- **Color**: Green when loaded, yellow when recharging, gray empty
- **Position**: Bottom-right corner
- **Recharge Bar**: Thin bar below boxes showing recharge progress

#### Pause Screen

```
╔═══════════════════════╗
║   GAME PAUSED         ║
║                       ║
║  Score: 1250          ║
║  Level: 3             ║
║                       ║
║  [RESUME]  [RESTART]  ║
╚═══════════════════════╝
```

- Overlay: Semi-transparent black background
- Centered white box with clear text
- Button styles: Hover effects, clear click targets
- Font: Bold, large, readable

#### Game Over Screen

```
╔═════════════════════════════╗
║   GAME OVER                 ║
║                             ║
║  Final Score:  2540         ║
║  High Score:   5280         ║
║  Level Reached: 7           ║
║                             ║
║  [PLAY AGAIN]  [QUIT]       ║
╚═════════════════════════════╝
```

- Shows final statistics
- Displays high score (writable for paper)
- Option to restart or quit
- Celebration effects if beat high score

#### Level Complete Screen

```
┌─────────────────────┐
│  LEVEL 5 COMPLETE!  │
│                     │
│  Bonus: +500 pts    │
│  Next Level...      │
└─────────────────────┘
```

- Brief transition (2 seconds)
- Shows bonus points earned
- Auto-advances to next level

### Layout & Responsive Design

#### Canvas Layout

```
┌─────────────────────────────────────┐
│ HUD (5% of height)                  │
├─────────────────────────────────────┤
│                                     │
│   FLIGHT ZONE (50% of height)       │
│   Detective Gulls flies here        │
│                                     │
├─────────────────────────────────────┤
│   STREET ZONE (33% of height)       │
│   Pedestrians walk here             │
│                                     │
│  (12% bottom padding)               │
└─────────────────────────────────────┘
```

#### Responsive Breakpoints

**Desktop (>1024px)**
- Canvas: 90% viewport width
- Aspect: 16:9
- Max width: 1920px

**Tablet (768-1024px)**
- Canvas: 95% viewport width
- Adjust touch targets (ammo indicator grows)
- UI text scales proportionally

**Mobile (< 768px)**
- Canvas: Full width
- UI elements reposition to mobile-friendly layout
- Larger touch targets
- Simplified HUD

### Animation Style

#### Movement Animations
- **Detective Wings**: 200ms flapping cycle, loops
- **Pedestrian Walking**: 600ms step cycle, loops
- **Projectiles**: Linear movement (no easing)
- **Pickups**: Gentle sine wave bobbing

#### Impact Animations
- **Poop Hit**: 300ms explosion particle burst
- **Taking Damage**: 150ms red flash + knockback
- **Collect Pickup**: 400ms grow + fade effect
- **Level Complete**: 500ms slide-in effect

#### Transition Animations
- **Screen Fade**: 300ms ease-in/out
- **Score Pop-up**: 600ms rise + fade
- **Level Advance**: 1s crossfade

### Sound Design

#### Effects (Synth-generated via Web Audio API)

**Poop Fire** (~200ms)
- Type: Sharp click/plop sound
- Pitch: Medium (500Hz sine)
- Envelope: Quick attack, fast decay
- Character: Light, comedic

**Hit Target** (~150ms)
- Type: Success/ping sound
- Pitch: Higher (1000Hz)
- Envelope: Attack, sustain, quick decay
- Character: Satisfying, arcade-like

**Take Damage** (~250ms)
- Type: Descending tone
- Pitch: Falls from 800Hz to 400Hz
- Envelope: Gradual decay
- Character: Painful, attention-grabbing

**Collect Pickup** (~300ms)
- Type: Ascending tone
- Pitch: Rises from 600Hz to 1200Hz
- Envelope: Gradual release
- Character: Rewarding, positive

**Level Complete** (~800ms)
- Type: Triumphant jingle
- Pitch: Ascending arpeggio (C-E-G melody)
- Envelope: Attack then sustain
- Character: Celebratory

**Game Over** (~1s)
- Type: Sad trombone
- Pitch: Descending slide
- Envelope: Long decay
- Character: Humorous defeat

**Ambience** (looping)
- Type: Traffic/crowd sounds
- Pitch: Low, background
- Character: Street atmosphere

## Game Feel

### Juice & Polish

**Screen Shake**
- Minor shake on impact (2-3 pixel displacement)
- Increases with level difficulty
- Gives weight to collisions

**Particle Effects**
- Poop impact creates brown particles
- Health pickup sparkles
- Enemy projectiles leave motion trails

**Visual Feedback**
- Score changes flash briefly
- Damage causes red tint
- Ammo indicator animates during recharge
- Detective changes color slightly when hit

### Audio Feedback
- Every action has audio consequence (no silent actions)
- Volume varies with intensity (big hits = louder)
- Distinct sounds for different event types

### Difficulty Feedback
- Visual cues show level difficulty (more enemies, faster)
- UI color changes as health decreases (green → yellow → red)
- Sound design becomes more intense at higher levels

## Accessibility

### Visual
- High contrast colors for visibility
- Screen reader-friendly HTML structure
- Colorblind-safe palette (avoiding red/green only distinction)
- Resizable text in UI

### Audio
- Visual indicator for sound-based events
- Captions/visual effects for all audio cues

### Controls
- Pause function always available (Space key)
- Large click targets
- Forgiving collision hitboxes (slightly generous)
- No time-critical text input

## Brand & Tone

**Overall Feel**: Dark humor, arcade fun, irreverent comedy
**Character Personality**: Noir detective meets seagull chaos
**Audience**: Ages 13+, appreciates crude humor
**Tone**: Comedic, not serious, glorifies the absurd

Detective Gulls is meant to be silly, funny, and over-the-top. Everything in the design should reinforce this tone—from the character design to the sound effects to the screen shake.
