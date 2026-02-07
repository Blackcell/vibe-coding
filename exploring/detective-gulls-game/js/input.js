// input.js - Input Handling (Mouse & Keyboard)

class InputHandler {
  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.keys = {};
  }
  
  /**
   * Update mouse position
   */
  updateMousePos(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }
  
  /**
   * Get mouse position
   */
  getMousePos() {
    return {
      x: this.mouseX,
      y: this.mouseY
    };
  }
  
  /**
   * Get key state
   */
  getKey(key) {
    return this.keys[key.toLowerCase()] || false;
  }
  
  /**
   * Set key state
   */
  setKey(key, state) {
    this.keys[key.toLowerCase()] = state;
  }
}
