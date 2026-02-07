// player.js - Detective Gulls (Player Character)

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    
    // Physics
    this.width = 40;
    this.height = 40;
    this.speed = 500; // pixels/second
    
    // Health
    this.health = 3;
    this.maxHealth = 3;
    this.invulnerableTime = 0;
    
    // Ammo system
    this.poopAmmo = 5;
    this.maxAmmo = 5;
    this.poopRechargeTime = 0; // milliseconds
    this.lastPoopTime = 0;
    this.poopCooldown = 0.6; // seconds between poops
    this.fireTimer = 0; // Timer to prevent rapid firing
    
    // Input
    this.targetX = x;
    this.targetY = y;
    this.isMouseDown = false;
    
    // Type identifier
    this.type = 'player';
    this.active = true;
    
    // Visual
    this.smokeTimer = 0; // Cigarette animation
  }
  
  /**
   * Reset player for new level
   */
  reset() {
    this.health = this.maxHealth;
    this.poopAmmo = this.maxAmmo;
    this.poopRechargeTime = 0;
    this.vx = 0;
    this.vy = 0;
    this.invulnerableTime = 0;
  }
  
  /**
   * Update player state and position
   */
  update(deltaTime, mousePos, mouseDown) {
    // Update invulnerability timer
    if (this.invulnerableTime > 0) {
      this.invulnerableTime -= deltaTime;
    }
    
    // Follow mouse position
    if (mousePos) {
      this.targetX = mousePos.x;
      this.targetY = mousePos.y;
    }
    
    // Smooth movement to target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const moveSpeed = this.speed * deltaTime;
      if (distance > moveSpeed) {
        this.x += (dx / distance) * moveSpeed;
        this.y += (dy / distance) * moveSpeed;
      } else {
        this.x = this.targetX;
        this.y = this.targetY;
      }
    }
    
    // Constrain to flight zone (upper 50% of screen, raised by 25%)
    const screenHeight = game.canvas.height;
    const maxY = screenHeight * 0.5; // Raised from 0.4 (25% higher)
    const minY = 30;
    const maxX = game.canvas.width - 20;
    const minX = 20;
    
    this.x = Math.max(minX, Math.min(maxX, this.x));
    this.y = Math.max(minY, Math.min(maxY, this.y));
    
    // Update ammo recharge
    if (this.poopAmmo < this.maxAmmo) {
      this.poopRechargeTime -= deltaTime;
      if (this.poopRechargeTime <= 0) {
        this.poopAmmo++;
        this.poopRechargeTime = this.poopCooldown; // Reset cooldown
        if (this.poopAmmo >= this.maxAmmo) {
          this.poopAmmo = this.maxAmmo;
          this.poopRechargeTime = 0;
        }
      }
    }
    
    // Update fire timer
    if (this.fireTimer > 0) {
      this.fireTimer -= deltaTime;
    }
    
    // Handle firing
    if (mouseDown && this.poopAmmo > 0 && this.fireTimer <= 0) {
      this.fire();
      this.fireTimer = this.poopCooldown; // Set cooldown between shots
    }
    
    // Update smoke animation
    this.smokeTimer += deltaTime;
    if (this.smokeTimer > 0.3) {
      this.smokeTimer = 0;
    }
  }
  
  /**
   * Fire a poop
   */
  fire() {
    game.spawnPoop(this.x, this.y);
    this.poopAmmo--;
    
    // Start recharge timer
    if (this.poopAmmo === 0) {
      this.poopRechargeTime = 3.0; // 3 second full recharge
    } else {
      this.poopRechargeTime = this.poopCooldown;
    }
    
    game.audioManager.playPoopFire();
  }
  
  /**
   * Take damage
   */
  takeDamage(amount) {
    if (this.invulnerableTime > 0) return; // Invulnerable
    
    this.health -= amount;
    this.invulnerableTime = 0.5; // 500ms invulnerability
  }
  
  /**
   * Heal (collect pickup)
   */
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
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
   * Draw player to canvas
   */
  draw(ctx) {
    // Flash if invulnerable
    if (this.invulnerableTime > 0) {
      const blink = Math.floor(this.invulnerableTime * 10) % 2;
      if (blink === 0) return;
    }
    
    const x = this.x;
    const y = this.y;
    
    // Draw seagull body (larger, more prominent)
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw trenchcoat outline
    ctx.strokeStyle = '#8B4513'; // Brown
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw trenchcoat lapels (brown filled area)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.lineTo(x - 18, y + 8);
    ctx.lineTo(x - 14, y + 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + 12, y);
    ctx.lineTo(x + 18, y + 8);
    ctx.lineTo(x + 14, y + 8);
    ctx.closePath();
    ctx.fill();
    
    // Draw head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y - 20, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fedora hat (black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 16, y - 36, 32, 10);
    ctx.beginPath();
    ctx.ellipse(x, y - 36, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fedora band (red)
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(x - 16, y - 28, 32, 3);
    
    // Draw normal eye (left)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 6, y - 22, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pupil (left eye)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - 5, y - 21, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eye patch (right eye - black circle with strap)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 7, y - 22, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eye patch strap
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 25);
    ctx.lineTo(x + 12, y - 18);
    ctx.stroke();
    
    // Draw cigarette (white stick with orange tip)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 16);
    ctx.lineTo(x + 22, y - 18);
    ctx.stroke();
    
    // Draw cigarette tip (glowing orange)
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    ctx.arc(x + 22, y - 18, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw smoke puff from cigarette
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.beginPath();
    ctx.arc(x + 26, y - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw wings (flapping animation)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2.5;
    const wingY = y + Math.sin(this.smokeTimer * Math.PI * 2) * 4;
    
    // Left wing
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.quadraticCurveTo(x - 28, wingY - 10, x - 22, y - 10);
    ctx.stroke();
    
    // Right wing
    ctx.beginPath();
    ctx.moveTo(x + 18, y);
    ctx.quadraticCurveTo(x + 28, wingY - 10, x + 22, y - 10);
    ctx.stroke();
    
    // Draw feet (yellow)
    ctx.fillStyle = '#FFB347';
    ctx.fillRect(x - 8, y + 16, 4, 5);
    ctx.fillRect(x + 4, y + 16, 4, 5);
    
    // Draw beak (orange)
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(x + 14, y - 18);
    ctx.lineTo(x + 20, y - 16);
    ctx.lineTo(x + 14, y - 14);
    ctx.closePath();
    ctx.fill();
  }
}
