// pedestrian.js - NPC Characters Walking the Street

class Pedestrian {
  constructor(x, y, vx, vy, game, config) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = 0; // Stay on ground
    
    this.width = 20;
    this.height = 24;
    this.type = 'pedestrian';
    this.active = true;
    
    // Reference to game
    this.game = game;
    this.config = config;
    
    // Behavior
    this.direction = vx > 0 ? 1 : -1;
    this.throwCooldown = Math.random() * 1.5 + 0.5; // 0.5-2 seconds between throws (faster)
    this.throwRange = 200; // pixels to "see" detective
    this.detectionTimer = 0;
    
    // Animation
    this.walkTimer = 0;
    this.throwingTimer = 0;
    this.isThrown = false;
  }
  
  /**
   * Update pedestrian AI
   */
  update(deltaTime) {
    // Movement
    this.x += this.vx * deltaTime;
    
    // Wrap around screen
    const screenWidth = this.game.canvas.width;
    if (this.x > screenWidth + 50) {
      this.x = -50;
    } else if (this.x < -50) {
      this.x = screenWidth + 50;
    }
    
    // Constrain to street area (bottom 33%)
    const screenHeight = this.game.canvas.height;
    const streetTop = screenHeight * (2/3);
    const groundLevel = screenHeight - 10;
    
    this.y = Math.max(streetTop, Math.min(groundLevel, this.y));
    
    // Detect detective nearby
    const dist = Math.hypot(
      this.game.player.x - this.x,
      this.game.player.y - this.y
    );
    
    const canSee = dist < this.throwRange;
    
    // Throwing behavior
    if (canSee) {
      this.throwCooldown -= deltaTime;
      
      if (this.throwCooldown <= 0) {
        this.throwProjectile();
        this.throwCooldown = Math.random() * 2 + 1; // Recharge: 1-3 seconds
        this.throwingTimer = 0.3;
      }
    }
    
    // Update timers
    this.walkTimer += deltaTime;
    if (this.throwingTimer > 0) {
      this.throwingTimer -= deltaTime;
    }
  }
  
  /**
   * Throw a projectile at Detective Gulls
   */
  throwProjectile() {
    if (!this.isThrown) {
      this.isThrown = true;
      
      // Calculate trajectory to aim at Detective Gulls
      const targetX = this.game.player.x;
      const targetY = this.game.player.y;
      const distX = targetX - this.x;
      const distY = targetY - this.y;
      
      // Calculate velocity to reach target with parabolic arc
      const gravity = 600;
      const flightTime = 0.6; // seconds to reach target
      
      // Horizontal velocity
      const vx = distX / flightTime;
      
      // Vertical velocity (accounting for gravity)
      const vy = (distY / flightTime) + (gravity * flightTime / 2);
      
      // Decide rock or bottle based on level
      const isBottle = Math.random() < this.game.levelConfig.bottleRatio;
      
      if (isBottle) {
        this.game.spawnBottle(this.x, this.y - 10, vx, vy);
      } else {
        this.game.spawnRock(this.x, this.y - 10, vx, vy);
      }
      
      setTimeout(() => {
        this.isThrown = false;
      }, 100);
    }
  }
  
  /**
   * Get bounding box
   */
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      w: this.width,
      h: this.height
    };
  }
  
  /**
   * Destroy pedestrian
   */
  destroy() {
    this.active = false;
  }
  
  /**
   * Draw pedestrian
   */
  draw(ctx) {
    const x = this.x;
    const y = this.y;
    const isThrowing = this.throwingTimer > 0;
    
    // Determine color (red or teal shirt)
    const shirtColor = Math.floor(x / 100) % 2 === 0 ? '#FF6B6B' : '#4ECDC4';
    const pantsColor = '#333333';
    
    // Draw body
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw head
    ctx.fillStyle = '#FFB6A3'; // Skin tone
    ctx.beginPath();
    ctx.arc(x, y - 14, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 2, y - 15, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 2, y - 15, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pants
    ctx.fillStyle = pantsColor;
    ctx.fillRect(x - 6, y + 4, 4, 8);
    ctx.fillRect(x + 2, y + 4, 4, 8);
    
    // Draw shoes
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 6, y + 12, 4, 3);
    ctx.fillRect(x + 2, y + 12, 4, 3);
    
    // Draw arms (animated or throwing)
    ctx.strokeStyle = '#FFB6A3';
    ctx.lineWidth = 2;
    
    if (isThrowing) {
      // Throwing pose
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 3);
      ctx.lineTo(x - 15, y - 12);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 3);
      ctx.lineTo(x + 15, y - 12);
      ctx.stroke();
    } else {
      // Walking pose - arms swing with legs
      const swing = Math.sin(this.walkTimer * 4) * 5;
      
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 3);
      ctx.lineTo(x - 10, y + swing + 3);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 3);
      ctx.lineTo(x + 10, y - swing + 3);
      ctx.stroke();
    }
  }
}
