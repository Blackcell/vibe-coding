// collision.js - Collision Detection
// Simple AABB (Axis-Aligned Bounding Box) collision detection

class Collision {
  /**
   * Check if two rectangles overlap
   */
  static checkAABB(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w &&
           rect1.x + rect1.w > rect2.x &&
           rect1.y < rect2.y + rect2.h &&
           rect1.y + rect1.h > rect2.y;
  }
  
  /**
   * Get overlap information
   */
  static getOverlap(rect1, rect2) {
    const overlapLeft = rect1.x + rect1.w - rect2.x;
    const overlapRight = rect2.x + rect2.w - rect1.x;
    const overlapTop = rect1.y + rect1.h - rect2.y;
    const overlapBottom = rect2.y + rect2.h - rect1.y;
    
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
    let direction = 'none';
    if (minOverlap === overlapLeft) direction = 'left';
    else if (minOverlap === overlapRight) direction = 'right';
    else if (minOverlap === overlapTop) direction = 'top';
    else if (minOverlap === overlapBottom) direction = 'bottom';
    
    return {
      overlap: minOverlap,
      direction: direction
    };
  }
  
  /**
   * Detect all collisions in a list of entities
   */
  static detectCollisions(entities) {
    const collisions = [];
    
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const boundsA = entities[i].getBounds();
        const boundsB = entities[j].getBounds();
        
        if (this.checkAABB(boundsA, boundsB)) {
          collisions.push({
            a: entities[i],
            b: entities[j],
            overlap: this.getOverlap(boundsA, boundsB)
          });
        }
      }
    }
    
    return collisions;
  }
  
  /**
   * Circle-to-rectangle collision (more generous for gameplay feel)
   */
  static checkCircleRect(circle, rect, radius = 0) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
    
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    
    return (distanceX * distanceX + distanceY * distanceY) < (radius * radius);
  }
}
