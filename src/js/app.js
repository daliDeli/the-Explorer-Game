import * as PIXI from 'pixi.js';
import Explorer from './Explorer';
const Application = PIXI.Application;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
const resources = PIXI.loader.resources;
const Text = PIXI.Text;
const Graphics =  PIXI.Graphics;

const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
});

document.body.appendChild(app.view);

let state, explorer;

PIXI.loader
    .add('src/img/chestHunt.json')
    .load(setup);


function setup() {
    const id = resources['src/img/chestHunt.json'].textures
    const screenSize = app.renderer.screen
    const randomY = Math.random() * screenSize.height;
    const gameScene = new Container();

    // CREATE dungeon
    const dungeon = new Sprite(
        id["dungeon.png"]
    );
    dungeon.width = screenSize.width;
    dungeon.height = screenSize.height;
    gameScene.addChild(dungeon);
    
    // CREATE door
    const door =  new Sprite(
        id['door.png']
    );
    gameScene.addChild(door);

    // CREATE explorer
    explorer = new Explorer(
        id['explorer.png']
    );
    explorer.position.set(0, screenSize.height / 2);
    
    // play area
    explorer.left.press = () => {
        explorer.vx = -5;
        explorer.vy = 0;
    };

    explorer.left.release = () => {
        if (!explorer.right.isDown && explorer.vy === 0) {
        explorer.vx = 0;
        }
    };
    
    explorer.up.press = () => {
        explorer.vy = -5;
        explorer.vx = 0;
    };
    explorer.up.release = () => {
        if (!explorer.down.isDown && explorer.vx === 0) {
        explorer.vy = 0;
        }
    };

    explorer.right.press = () => {
        explorer.vx = 5;
        explorer.vy = 0;
    };
    explorer.right.release = () => {
        if (!explorer.left.isDown && explorer.vy === 0) {
        explorer.vx = 0;
        }
    };

    explorer.down.press = () => {
        explorer.vy = 5;
        explorer.vx = 0;
    };
    explorer.down.release = () => {
        if (!explorer.up.isDown && explorer.vx === 0) {
        explorer.vy = 0;
        }
    };

    gameScene.addChild(explorer);

    // CREATE treasure
    const treasure =  new Sprite(
        id['treasure.png']
    );
    treasure.position.set(screenSize.width-50, Math.random() * randomY);
    gameScene.addChild(treasure);

    // CREATE foes
    for(let i = 0; i < generatingFoes(); i++){
        const blob =  new Sprite(
            id['blob.png']
        );
        blob.position.set(150 + i * 100, Math.random() * randomY)
        gameScene.addChild(blob);
    }

    // CREATE healthbar
     const healthBar = new Container();
     healthBar.position.set(screenSize.width -160, 10);
     gameScene.addChild(healthBar);
 
     const redRect = new Graphics();
     redRect.beginFill(0xff0000);
     redRect.drawRect(0, 0, 150, 15);
     redRect.endFill();
     healthBar.addChild(redRect);
    
    const greenRect = new Graphics();
    greenRect.beginFill(0x00ff00);
    greenRect.drawRect(0, 0, 150, 15);
    greenRect.endFill();
    healthBar.addChild(greenRect);

    // staging the gamescene
    app.stage.addChild(gameScene);

    const gameOverText = new Text('Game Over');
    const gameOverScene = new Container();
    gameOverScene.addChild(gameOverText);
    gameOverScene.visible = false;

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }
  
function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    //Move the explorer and contain it inside the dungeon
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;
    //Move the blob monsters
    //Check for a collision between the blobs and the explorer
    //Check for a collision between the explorer and the treasure
    //Check for a collision between the treasure and the door
    //Decide whether the game has been won or lost
    //Change the game `state` to `end` when the game is finished
}

function end() {
}

// Helper functions

function generatingFoes() {
    return 3 + Math.floor( Math.random() * 12 );

}
