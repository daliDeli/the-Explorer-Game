import * as PIXI from 'pixi.js';
import { contain } from './helpers/containment';
import { collisionTest } from './helpers/collision';
import { generateFoes } from './helpers/monsterGenerator';
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

const screenSize = app.renderer.screen;
const monsters = [];
let state, explorer, blob, explorerHit,
healthBar, treasure, door, gameOverText,
gameScene, gameOverScene;

PIXI.loader
    .add('src/img/chestHunt.json')
    .load(setup);

function setup() {
    const id = resources['src/img/chestHunt.json'].textures
    const randomY = Math.random() * screenSize.height;
    gameScene = new Container();

    // dungeon
    const dungeon = new Sprite(
        id["dungeon.png"]
    );
    dungeon.width = screenSize.width;
    dungeon.height = screenSize.height;
    gameScene.addChild(dungeon);
    
    // door
    door =  new Sprite(
        id['door.png']
    );
    door.position.set(30,10);
    gameScene.addChild(door);

    // chest
    treasure =  new Sprite(
        id['treasure.png']
    );
    treasure.position.set(screenSize.width-50, screenSize.height / 2);
    gameScene.addChild(treasure);

    // foes
    let direction = 1;
    for(let i = 0; i < generateFoes(); i++){
        blob =  new Sprite(
            id['blob.png']
        );
        blob.position.set(150 + i * 100, Math.random() * randomY);
        blob.vy = 5 + Math.random() * 8 * direction;
        direction *= -1;
        monsters.push(blob);
        gameScene.addChild(blob);
    }

    // explorer
    explorer = new Explorer(
        id['explorer.png']
    );
    explorer.position.set(0, screenSize.height / 2);
    gameScene.addChild(explorer);

    // health
    healthBar = new Container();
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

    healthBar.health = greenRect;

    // staging the game scene
    app.stage.addChild(gameScene);

    // game over scene
    const style = new PIXI.TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "white"
      });
    gameOverText = new Text('Game', style);
    gameOverText.position.set(screenSize.width / 2 - 64, screenSize.height / 2 - 32);
    gameOverScene = new Container();
    gameOverScene.addChild(gameOverText);
    // gameOverScene.visible = false;

    // GAME STATE
    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }
  
function gameLoop(delta) {
    state(delta);
}

function play() {
    // move the explorer & contain him
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;

    contain(
        explorer,
        {
            x: 30,
            y: 30,
            width: screenSize.width - 30,
            height: screenSize.height - 30
        }
    );
    // move the monsters & check for a collision
    monsters.forEach( blob => {
        blob.y += blob.vy;

        let blobHitsWall = contain(
            blob,
            {
                x: 30,
                y: 30,
                width: screenSize.width - 30,
                height: screenSize.height - 30
            }
        );

        if (blobHitsWall === "top" || blobHitsWall === "bottom") {
            blob.vy *= -1;
        }
        if(collisionTest(explorer, blob)) {
            explorerHit = true;
        }
    })

    if(explorerHit) {
        // make the explorer semi-transparent
        explorer.alpha = 0.5;
      
        // reduce the width of the health bar
        healthBar.health.width -= 5;
        explorerHit = false;
      } else {
        // make the explorer normal if it hasn't been hit
        explorer.alpha = 1;
      }
    // check for a collision 
    if (collisionTest(explorer, treasure)) {
        treasure.x = explorer.x + 8;
        treasure.y = explorer.y + 8;
        
      }
    // check if the explorer is alive
      if (healthBar.health.width < 0) {
        state = end;
        gameOverText.text = 'You lost!';
      }
    // check for a collision 
    if (collisionTest(treasure, door)) {
        state = end;
        gameOverText.text = 'You won';
      }
}
//change the game state to end when the game is finished
function end() {
    gameScene.visible = false;
    app.stage.addChild(gameOverScene);
    // gameOverScene.visible = true;
}
