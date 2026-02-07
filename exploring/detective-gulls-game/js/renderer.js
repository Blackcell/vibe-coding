// renderer.js - Canvas Drawing Functions

class Renderer {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }
  
  /**
   * Clear entire canvas
   */
  clear() {
    // Clear with sky blue background
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Draw the street area
   */
  drawStreet(canvasHeight) {
    const ctx = this.ctx;
    const streetTop = canvasHeight * (2/3);
    const streetHeight = canvasHeight * (1/3);
    
    // Street background
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, streetTop, this.canvas.width, streetHeight);
    
    // Road markings (dashed lines)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, streetTop + streetHeight / 2);
    ctx.lineTo(this.canvas.width, streetTop + streetHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Sidewalk edge
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, streetTop);
    ctx.lineTo(this.canvas.width, streetTop);
    ctx.stroke();
  }
  
  /**
   * Draw the score/HUD
   * (Called from UI system, included here for reference)
   */
  drawHUD(score, level, time) {
    // See ui.js for actual HUD drawing
  }
}
