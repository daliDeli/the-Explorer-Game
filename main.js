const Application = PIXI.Application;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
const resources = PIXI.loader.resources;
const Text = PIXI.Text;

const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
});

document.body.appendChild(app.view);
console.log(app.renderer.screen);
PIXI.loader
    .add('img/treasureHunter.json')
    .load(setup)

function setup() {
    const id = resources['img/treasureHunter.json'].textures
    const screenSize = app.renderer.screen
    const gameScene = new Container();

    dungeon = new Sprite(
        id["dungeon.png"]
    );
    dungeon.width = screenSize.width;
    dungeon.height = screenSize.height;

    gameScene.addChild(dungeon);
    
    const door =  new Sprite(
        id['door.png']
    );
    gameScene.addChild(door);

    const explorer =  new Sprite(
        id['explorer.png']
    );
    gameScene.addChild(explorer);

    const treasure =  new Sprite(
        id['treasure.png']
    );
    gameScene.addChild(treasure);

    const blob =  new Sprite(
        id['blob.png']
    );
    gameScene.addChild(blob);

    app.stage.addChild(gameScene);

    const gameOverText = new Text('Game Over');

    const gameOverScene = new Container();
    gameOverScene.addChild(gameOverText);
    gameOverScene.visible = false;

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }
  
  function gameLoop(delta) {
  }
  
  function play(delta) {
  }
  
  function end() {
  }