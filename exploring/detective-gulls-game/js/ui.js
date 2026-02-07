// ui.js - HUD and UI Elements

class UI {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }
  
  /**
   * Draw main HUD
   */
  drawHUD(ctx, state) {
    const padding = 20;
    const fontSize = 18;
    
    // Draw semi-transparent HUD background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, this.canvas.width, fontSize * 2.5);
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#FFFFFF';
    
    // Score (left)
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, padding, padding + fontSize);
    
    // Level (center)
    ctx.textAlign = 'center';
    ctx.fillText(`Level: ${state.level}`, this.canvas.width / 2, padding + fontSize);
    
    // Time (right - turn red if low)
    ctx.textAlign = 'right';
    ctx.fillStyle = state.time <= 10 ? '#FF4444' : '#FFFFFF';
    ctx.fillText(`Time: ${state.time}s`, this.canvas.width - padding, padding + fontSize);
    
    // Lives (hearts, top-right corner)
    this.drawLives(state.lives);
    
    // Ammo indicator (bottom-right)
    this.drawAmmo(state.ammo, state.rechargePercent);
  }
  
  /**
   * Draw lives as hearts
   */
  drawLives(lives) {
    const ctx = this.ctx;
    const heartSize = 16;
    const spacing = 20;
    const startX = this.canvas.width - 100;
    const startY = 20;
    
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText('Lives:', startX - 10, startY + heartSize);
    
    for (let i = 0; i < 3; i++) {
      const x = startX + i * spacing;
      const y = startY;
      
      if (i < lives) {
        // Full heart
        ctx.fillStyle = '#FF0000';
      } else {
        // Empty heart
        ctx.fillStyle = '#333333';
      }
      
      this.drawHeart(x, y, heartSize);
    }
  }
  
  /**
   * Draw a single heart shape
   */
  drawHeart(x, y, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    
    // Left lobe
    ctx.bezierCurveTo(
      x - size / 2, y - size / 4,
      x - size / 2, y + size / 2,
      x, y + size
    );
    
    // Right lobe
    ctx.bezierCurveTo(
      x + size / 2, y + size / 2,
      x + size / 2, y - size / 4,
      x, y + size / 4
    );
    
    ctx.closePath();
    ctx.fill();
  }
  
  /**
   * Draw ammo indicator
   */
  drawAmmo(ammo, rechargePercent) {
    const ctx = this.ctx;
    const boxSize = 12;
    const spacing = 16;
    const startX = this.canvas.width - 120;
    const startY = this.canvas.height - 50;
    
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('Ammo:', startX, startY - 5);
    
    // Draw 5 ammo boxes
    for (let i = 0; i < 5; i++) {
      const x = startX + i * spacing;
      const y = startY + 5;
      
      if (i < ammo) {
        ctx.fillStyle = '#00FF00'; // Green - loaded
      } else if (ammo === 0 && i === 0) {
        ctx.fillStyle = '#FFFF00'; // Yellow - recharging
      } else {
        ctx.fillStyle = '#666666'; // Gray - empty
      }
      
      ctx.fillRect(x, y, boxSize, boxSize);
      
      // Border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxSize, boxSize);
    }
    
    // Draw recharge bar if recharging
    if (ammo === 0 && rechargePercent < 1) {
      ctx.fillStyle = '#FFFF00';
      const barWidth = spacing * 5 - 3;
      const filledWidth = barWidth * rechargePercent;
      ctx.fillRect(startX, startY + 20, filledWidth, 4);
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY + 20, barWidth, 4);
    }
  }
  
  /**
   * Draw pause screen
   */
  drawPauseScreen(ctx, state) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Pause box
    const boxWidth = 300;
    const boxHeight = 200;
    const boxX = (this.canvas.width - boxWidth) / 2;
    const boxY = (this.canvas.height - boxHeight) / 2;
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    // Text
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', this.canvas.width / 2, boxY + 60);
    
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Score: ${state.score}`, this.canvas.width / 2, boxY + 100);
    ctx.fillText(`Level: ${state.level}`, this.canvas.width / 2, boxY + 130);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('Press SPACE to resume', this.canvas.width / 2, boxY + 160);
    ctx.fillText('Press R to restart', this.canvas.width / 2, boxY + 180);
  }
  
  /**
   * Draw game over screen
   */
  drawGameOverScreen(ctx, state) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Game over box
    const boxWidth = 350;
    const boxHeight = 250;
    const boxX = (this.canvas.width - boxWidth) / 2;
    const boxY = (this.canvas.height - boxHeight) / 2;
    
    ctx.fillStyle = '#1a0000';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    // Text
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#FF0000';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.canvas.width / 2, boxY + 50);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Final Score: ${state.finalScore}`, this.canvas.width / 2, boxY + 100);
    ctx.fillText(`High Score: ${state.highScore}`, this.canvas.width / 2, boxY + 140);
    ctx.fillText(`Level Reached: ${state.level}`, this.canvas.width / 2, boxY + 180);
    
    // Check if new high score
    if (state.finalScore === state.highScore && state.finalScore > 0) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, boxY + 220);
    }
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('Press R to restart', this.canvas.width / 2, boxY + 230);
  }
  
  /**
   * Draw level complete screen
   */
  drawLevelCompleteScreen(ctx, state) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Message box
    const boxWidth = 320;
    const boxHeight = 150;
    const boxX = (this.canvas.width - boxWidth) / 2;
    const boxY = (this.canvas.height - boxHeight) / 2;
    
    ctx.fillStyle = '#001a00';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    // Text
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#00FF00';
    ctx.textAlign = 'center';
    ctx.fillText(`LEVEL ${state.level} COMPLETE!`, this.canvas.width / 2, boxY + 45);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Bonus: +${state.bonus} pts`, this.canvas.width / 2, boxY + 90);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('Next level...', this.canvas.width / 2, boxY + 130);
  }
}
