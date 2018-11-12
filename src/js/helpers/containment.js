export function contain(sprite, container) {

    let collision = undefined;
  
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }
  
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }
  
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }
  
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }
    
    return collision;
  }