class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // player sprites
        this.load.image('playerUp', "/assets/playerUp.png");
        this.load.image('playerDown', "/assets/playerDown.png");
        this.load.image('playerRight', "/assets/playerRight.png");
        this.load.image('playerLeft', "/assets/playerLeft.png");
        this.load.image('player-projectile', "/assets/playerProjectile.png");
        // enemy sprites
        this.load.image('enemyUp', "/assets/enemyUp.png");
        this.load.image('enemyDown', "/assets/enemyDown.png");
        this.load.image('enemyRight', "/assets/enemyRight.png");
        this.load.image('enemyLeft', "/assets/enemyLeft.png");
        this.load.image('enemy-projectile', "/assets/enemyProjectile.png");
        // load map
        this.load.image('tiles', '/assets/tiles.png');
        this.load.tilemapTiledJSON('tilemap', '/assets/tilemap.json');
    }

    create() {
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let titleConfig = {
            fontSize: '36px',
            color: '#000000',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 600,
            fixedHeight: 0,
            stroke: '#ffffff',
            strokeThickness: 8
        }
        this.titleText = this.add.text(game.config.width/2, 100, 'Prototype 3C', titleConfig).setOrigin(0.5);

        let menuConfig = {
            fontSize: '26px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 600,
            fixedHeight: 0,
        }
        this.add.text(game.config.width/2, 200, 'Press SPACE to play!', menuConfig).setOrigin(0.5);

    }

    update() {
        //start game when spacebar pressed
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.stop();
            this.scene.start("playScene");
        }
    }
}