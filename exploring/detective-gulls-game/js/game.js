// game.js - Core Game State Manager
// Manages game state, entity spawning, collisions, and level progression

class Game {
  constructor() {
    // Game state
    this.isRunning = false;
    this.isPaused = false;
    this.gameOver = false;
    this.levelComplete = false;
    
    // Game progression
    this.level = 1;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    this.timeRemaining = 60; // 60 seconds per level
    
    // Entities
    this.player = null;
    this.pedestrians = [];
    this.projectiles = [];
    
    // Canvas and rendering
    this.canvas = null;
    this.ctx = null;
    this.renderer = null;
    this.ui = null;
    
    // Input and audio
    this.inputHandler = null;
    this.audioManager = null;
    
    // Spawning
    this.pedestrianSpawnTimer = 0;
    this.projectileSpawnTimer = 0;
    this.pickupSpawnTimer = 0;
    
    // Config for current level
    this.levelConfig = null;
  }
  
  /**
   * Initialize canvas and setup
   */
  initCanvas() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Setup canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Initialize systems
    this.renderer = new Renderer(this.ctx, this.canvas);
    this.ui = new UI(this.ctx, this.canvas);
    this.inputHandler = new InputHandler();
    this.audioManager = new AudioManager();
  }
  
  /**
   * Resize canvas to fit window
   */
  resizeCanvas() {
    const width = Math.min(window.innerWidth * 0.9, 1920);
    const height = width * 9 / 16; // 16:9 aspect ratio
    
    this.canvas.width = Math.max(width, 800);
    this.canvas.height = Math.max(height, 450);
  }
  
  /**
   * Setup input handlers
   */
  setupInput() {
    const canvas = this.canvas;
    
    // Mouse movement
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.inputHandler.updateMousePos(x, y);
    });
    
    // Mouse click
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left click
        this.inputHandler.mouseDown = true;
      }
    });
    
    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.inputHandler.mouseDown = false;
      }
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          this.togglePause();
          break;
        case 'r':
          this.restartLevel();
          break;
      }
    });
  }
  
  /**
   * Start a level
   */
  startLevel(levelNum) {
    this.level = Math.max(1, Math.min(20, levelNum));
    this.timeRemaining = 60;
    this.levelComplete = false;
    this.gameOver = false;
    this.isRunning = true;
    this.isPaused = false;
    
    // Get difficulty config for this level
    this.levelConfig = this.getLevelConfig(this.level);
    
    // Create or reset player
    if (!this.player) {
      this.player = new Player(this.canvas.width / 2, this.canvas.height * 0.4);
    } else {
      this.player.reset();
      this.player.x = this.canvas.width / 2;
      this.player.y = this.canvas.height * 0.4;
    }
    
    // Clear entities
    this.pedestrians = [];
    this.projectiles = [];
    
    // Reset timers
    this.pedestrianSpawnTimer = 0;
    this.projectileSpawnTimer = 0;
    this.pickupSpawnTimer = 0;
    
    // Spawn initial pedestrians
    const count = this.levelConfig.pedestrianCount;
    for (let i = 0; i < count; i++) {
      this.spawnPedestrian();
    }
    
    console.log(`Started Level ${this.level}`, this.levelConfig);
    this.audioManager.playLevelUp();
  }
  
  /**
   * Get configuration for a specific level
   */
  getLevelConfig(levelNum) {
    const progress = (levelNum - 1) / 19; // 0 to 1
    
    return {
      pedestrianCount: 2 + Math.floor(progress * 8),          // 2-10 pedestrians
      pedestrianSpeed: 1.5 + progress * 28.5,                 // 1.5-30x base speed (50% slower at level 1)
      projectileFrequency: 0.3 + progress * 0.7,              // 30%-100% throw rate
      bottleRatio: progress * 0.7,                            // 0% to 70% bottles
      pickupFrequency: Math.max(0.02 - progress * 0.01, 0.005) // Decreasing pickup rate
    };
  }
  
  /**
   * Restart current level
   */
  restartLevel() {
    this.startLevel(this.level);
  }
  
  /**
   * Toggle pause
   */
  togglePause() {
    if (this.gameOver || this.levelComplete) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      console.log('Game paused');
    } else {
      console.log('Game resumed');
    }
  }
  
  /**
   * Main update loop
   */
  update(deltaTime) {
    if (this.isPaused) return;
    
    // Update time
    this.timeRemaining -= deltaTime;
    if (this.timeRemaining <= 0) {
      this.completeLevel();
      return;
    }
    
    // Update player
    const mousePos = this.inputHandler.getMousePos();
    this.player.update(deltaTime, mousePos, this.inputHandler.mouseDown);
    
    // Update pedestrians
    this.pedestrians.forEach(p => p.update(deltaTime));
    
    // Update projectiles
    this.projectiles.forEach(p => p.update(deltaTime));
    
    // Remove inactive entities
    this.pedestrians = this.pedestrians.filter(p => p.active);
    this.projectiles = this.projectiles.filter(p => p.active);
    
    // Spawn new pedestrians
    this.pedestrianSpawnTimer -= deltaTime;
    if (this.pedestrianSpawnTimer <= 0) {
      if (this.pedestrians.length < this.levelConfig.pedestrianCount) {
        this.spawnPedestrian();
        this.pedestrianSpawnTimer = 2; // Spawn every 2 seconds max
      }
    }
    
    // Spawn pickups randomly
    this.pickupSpawnTimer -= deltaTime;
    if (this.pickupSpawnTimer <= 0) {
      if (Math.random() < this.levelConfig.pickupFrequency) {
        this.spawnPickup();
      }
      this.pickupSpawnTimer = 0.1; // Check every 100ms
    }
    
    // Detect collisions
    this.detectCollisions();
    
    // Check lose condition
    if (this.player.health <= 0) {
      this.gameOver = true;
      this.isRunning = false;
      this.updateHighScore();
      this.audioManager.playGameOver();
    }
  }
  
  /**
   * Render everything
   */
  render() {
    // Clear canvas
    this.renderer.clear();
    
    // Draw game world
    if (!this.gameOver && !this.levelComplete) {
      // Draw street background
      this.renderer.drawStreet(this.canvas.height);
      
      // Draw all entities
      this.pedestrians.forEach(p => p.draw(this.ctx));
      this.projectiles.forEach(p => p.draw(this.ctx));
      this.player.draw(this.ctx);
      
      // Draw HUD
      this.ui.drawHUD(this.ctx, {
        score: this.score,
        lives: this.player.health,
        level: this.level,
        time: Math.ceil(this.timeRemaining),
        ammo: this.player.poopAmmo,
        rechargePercent: Math.max(0, 1 - (this.player.poopRechargeTime / 3000))
      });
    }
    
    // Draw pause screen
    if (this.isPaused) {
      this.ui.drawPauseScreen(this.ctx, {
        score: this.score,
        level: this.level
      });
    }
    
    // Draw game over screen
    if (this.gameOver) {
      this.ui.drawGameOverScreen(this.ctx, {
        finalScore: this.score,
        highScore: this.highScore,
        level: this.level
      });
    }
    
    // Draw level complete screen
    if (this.levelComplete) {
      this.ui.drawLevelCompleteScreen(this.ctx, {
        level: this.level,
        bonus: 500
      });
    }
  }
  
  /**
   * Detect all collisions
   */
  detectCollisions() {
    // Poop vs Pedestrians
    this.projectiles.forEach(projectile => {
      if (projectile.type === 'poop' && projectile.active) {
        this.pedestrians.forEach(pedestrian => {
          if (pedestrian.active && this.checkAABBCollision(projectile, pedestrian)) {
            // Hit!
            this.score += 100;
            projectile.destroy();
            pedestrian.destroy();
            this.audioManager.playHitTarget();
          }
        });
      }
    });
    
    // Rocks/Bottles vs Detective
    this.projectiles.forEach(projectile => {
      if ((projectile.type === 'rock' || projectile.type === 'bottle') && projectile.active) {
        if (this.checkAABBCollision(projectile, this.player)) {
          // Hit detective!
          const damage = projectile.type === 'bottle' ? 10 : 5;
          const pointLoss = projectile.type === 'bottle' ? 50 : 20;
          
          this.player.takeDamage(damage);
          this.score = Math.max(0, this.score - pointLoss);
          projectile.destroy();
          this.audioManager.playTakeDamage();
        }
      }
    });
    
    // Cigarette Packs vs Detective
    this.projectiles.forEach(projectile => {
      if (projectile.type === 'cigarette' && projectile.active) {
        if (this.checkAABBCollision(projectile, this.player)) {
          // Collect!
          const heal = Math.floor(2 + Math.random() * 2); // 2-3 health
          this.player.heal(heal);
          projectile.destroy();
          this.audioManager.playCollectPickup();
        }
      }
    });
  }
  
  /**
   * Simple AABB collision check
   */
  checkAABBCollision(a, b) {
    const boundsA = a.getBounds();
    const boundsB = b.getBounds();
    
    return boundsA.x < boundsB.x + boundsB.w &&
           boundsA.x + boundsA.w > boundsB.x &&
           boundsA.y < boundsB.y + boundsB.h &&
           boundsA.y + boundsA.h > boundsB.y;
  }
  
  /**
   * Spawn a new pedestrian
   */
  spawnPedestrian() {
    const config = this.levelConfig;
    const x = Math.random() < 0.5 ? -30 : this.canvas.width + 30;
    const y = this.canvas.height * (2/3 + Math.random() * 0.3);
    const speed = (50 + Math.random() * 30) * config.pedestrianSpeed;
    const direction = x < 0 ? 1 : -1;
    
    const pedestrian = new Pedestrian(x, y, direction * speed, 0, this, config);
    this.pedestrians.push(pedestrian);
  }
  
  /**
   * Spawn a poop at player position
   */
  spawnPoop(x, y) {
    const poop = new Poop(x, y);
    this.projectiles.push(poop);
  }
  
  /**
   * Spawn a rock from a pedestrian
   */
  spawnRock(x, y, vx, vy) {
    // Use provided velocity or default random trajectory
    if (vx === undefined) {
      vx = (Math.random() - 0.5) * 400;
    }
    if (vy === undefined) {
      vy = -500 + Math.random() * 100;
    }
    const rock = new Rock(x, y, vx, vy);
    this.projectiles.push(rock);
  }
  
  /**
   * Spawn a bottle from a pedestrian
   */
  spawnBottle(x, y, vx, vy) {
    // Use provided velocity or default random trajectory
    if (vx === undefined) {
      vx = (Math.random() - 0.5) * 300;
    }
    if (vy === undefined) {
      vy = -400 + Math.random() * 100;
    }
    const bottle = new Bottle(x, y, vx, vy);
    this.projectiles.push(bottle);
  }
  
  /**
   * Spawn a cigarette pickup
   */
  spawnPickup() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height * 0.5; // Upper half
    const pickup = new CigarettePack(x, y);
    this.projectiles.push(pickup);
  }
  
  /**
   * Complete current level
   */
  completeLevel() {
    this.levelComplete = true;
    this.isRunning = false;
    
    // Add bonus points
    const bonus = 500;
    this.score += bonus;
    
    this.audioManager.playLevelUp();
    
    // Auto-advance to next level after delay
    setTimeout(() => {
      if (this.level < 20) {
        this.startLevel(this.level + 1);
      } else {
        // Beat the game!
        this.gameOver = true;
        console.log('YOU WIN! Beat all 20 levels!');
      }
    }, 2500);
  }
  
  /**
   * Update high score
   */
  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
      console.log('New high score:', this.highScore);
    }
  }
  
  /**
   * Cleanup on page unload
   */
  cleanup() {
    this.audioManager.cleanup();
  }
}
