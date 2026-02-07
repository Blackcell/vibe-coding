// projectile.js - All flying/falling objects (poop, rocks, bottles, pickups)

/**
 * Base Projectile class
 */
class Projectile {
  constructor(x, y, vx, vy, width, height) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = width;
    this.height = height;
    
    this.type = 'projectile';
    this.active = true;
    
    // Physics
    this.gravity = 600; // pixels/s²
    this.bounceDamping = 0.3; // Energy loss on bounce
    this.groundLevel = 0; // Set by game
  }
  
  /**
   * Update position
   */
  update(deltaTime) {
    // Apply gravity
    this.vy += this.gravity * deltaTime;
    
    // Move
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Despawn if off-screen
    if (this.y > game.canvas.height + 100 ||
        this.x < -50 ||
        this.x > game.canvas.width + 50) {
      this.destroy();
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
   * Destroy projectile
   */
  destroy() {
    this.active = false;
  }
  
  /**
   * Draw (override in subclass)
   */
  draw(ctx) {
    // Placeholder
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
  }
}

/**
 * Poop - Player attack projectile
 */
class Poop extends Projectile {
  constructor(x, y) {
    super(x, y, 0, 0, 8, 8);
    this.type = 'poop';
    this.gravity = 600;
  }
  
  update(deltaTime) {
    super.update(deltaTime);
    
    // Poop falls straight down
    this.vx *= 0.95; // Slight air resistance
  }
  
  draw(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add splat effect
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.arc(this.x - 3, this.y + 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 3, this.y + 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Rock - Small enemy projectile
 */
class Rock extends Projectile {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy, 10, 10);
    this.type = 'rock';
    this.damage = 5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
  }
  
  update(deltaTime) {
    super.update(deltaTime);
    this.rotation += this.rotationSpeed * deltaTime;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw irregular rock shape
    ctx.fillStyle = '#A9A9A9';
    ctx.beginPath();
    ctx.moveTo(-4, -4);
    ctx.lineTo(4, -3);
    ctx.lineTo(5, 3);
    ctx.lineTo(1, 5);
    ctx.lineTo(-3, 4);
    ctx.lineTo(-5, 1);
    ctx.closePath();
    ctx.fill();
    
    // Add shading
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }
}

/**
 * Bottle - Large enemy projectile
 */
class Bottle extends Projectile {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy, 12, 16);
    this.type = 'bottle';
    this.damage = 10;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 6;
  }
  
  update(deltaTime) {
    super.update(deltaTime);
    this.rotation += this.rotationSpeed * deltaTime;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw bottle body
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(-5, -6, 10, 14);
    
    // Draw bottle neck
    ctx.fillRect(-2, -8, 4, 3);
    
    // Add glass highlight
    ctx.strokeStyle = '#A0826D';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-3, -4);
    ctx.lineTo(-2, 6);
    ctx.stroke();
    
    ctx.restore();
  }
}

/**
 * Cigarette Pack - Health pickup
 */
class CigarettePack extends Projectile {
  constructor(x, y) {
    super(x, y, 0, -50, 12, 14); // Float upward initially
    this.type = 'cigarette';
    this.lifespan = 5; // Disappear after 5 seconds
    this.elapsed = 0;
    this.bobOffset = 0;
  }
  
  update(deltaTime) {
    // Don't apply normal gravity
    this.x += this.vx * deltaTime;
    
    // Gentle upward float
    this.vy -= 20 * deltaTime;
    this.vy = Math.max(-100, this.vy);
    
    this.y += this.vy * deltaTime;
    
    // Bobbing animation
    this.elapsed += deltaTime;
    this.bobOffset = Math.sin(this.elapsed * 3) * 15;
    
    // Fade out and despawn after lifespan
    if (this.elapsed > this.lifespan) {
      this.destroy();
    }
    
    // Despawn if off-screen
    if (this.x < -50 || this.x > game.canvas.width + 50 || this.y < -50) {
      this.destroy();
    }
  }
  
  draw(ctx) {
    // Fade effect
    const alpha = Math.max(0, 1 - (this.elapsed / this.lifespan));
    ctx.globalAlpha = alpha;
    
    ctx.save();
    ctx.translate(this.x, this.y + this.bobOffset);
    
    // Draw cigarette pack (red box with white accents)
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(-6, -7, 12, 14);
    
    // Draw white stripes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-5, -5, 10, 2);
    ctx.fillRect(-5, 0, 10, 2);
    ctx.fillRect(-5, 4, 10, 2);
    
    // Add sparkle effect
    if (this.elapsed < this.lifespan * 0.8) {
      ctx.fillStyle = '#FFFF00';
      const sparkle1 = Math.sin(this.elapsed * 6) * 3;
      const sparkle2 = Math.cos(this.elapsed * 5) * 3;
      
      ctx.beginPath();
      ctx.arc(-3 + sparkle1, -8 + sparkle2, 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(4 - sparkle1, 6 - sparkle2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
