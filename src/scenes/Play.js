class Play extends Phaser.Scene {

    width = game.config.width;
    height = game.config.height;

     collectedSouls = 0;

    enemyPositions = [
        {x: 145, y: 1180, direction: "Right"},
        {x: 335, y: 1035, direction: "Down"},
        {x: 335, y: 1300, direction: "Up"},
        {x: 205, y: 720, direction: "Down"},
        {x: 500, y: 720, direction: "Left"},
        {x: 340, y: 560, direction: "Down"},
        {x: 80, y: 560, direction: "Down"},
        {x: 720, y: 1040, direction: "Down"},
        {x: 1230, y: 1040, direction: "Down"},
        {x: 720, y: 815, direction: "Right"},
        {x: 1260, y: 720, direction: "Left"},
        {x: 720, y: 520, direction: "Right"},
        {x: 850, y: 330, direction: "Down"},
        {x: 1060, y: 330, direction: "Down"},
        {x: 1140, y: 145, direction: "Down"},
        {x: 770, y: 145, direction: "Down"},
        {x: 400, y: 335, direction: "Up"},
        {x: 400, y: 140, direction: "Down"},
        {x: 110, y: 240, direction: "Right"},
        {x: 1550, y: 1330, direction: "Up"},
        {x: 1740, y: 1330, direction: "Up"},
        {x: 1800, y: 940, direction: "Left"},
        {x: 1460, y: 750, direction: "Right"},
        {x: 1745, y: 780, direction: "Up"},
        {x: 1710, y: 560, direction: "Left"},
        {x: 1800, y: 400, direction: "Left"},
        {x: 1450, y: 170, direction: "Down"},
        {x: 1800, y: 175, direction: "Left"},
    ];
    enemies = [];

    constructor() {
        super("playScene");
    }

    create() {
        this.gameWon = false;

        // set keyboard keys
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.physics.world.setBounds(0, 0, game.config.width * 3, game.config.height * 3);
        this.cameras.main.setBounds(0, 0, game.config.width * 3, game.config.height * 3);

        this.playerProjecilesGroup = this.physics.add.group();
        this.enemyProjectilesGroup = this.physics.add.group();
        this.enemyGhostProjectilesGroup = this.physics.add.group();

        //player character
        this.player = new Player(this, game.config.width * 2 - (game.config.width / 2), game.config.height * 3 - 100, 'playerUp', 0).setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);
        this.player.alpha = 1;
        this.physics.add.collider(this.player, this.enemyProjectilesGroup, (player, projectile) => {
            projectile.destroy();
            player.playerDeath();
        }); 
        this.physics.add.collider(this.player, this.enemyGhostProjectilesGroup, (player, projectile) => {
            projectile.destroy();
            player.playerDeath();
        }); 

        this.cameras.main.startFollow(this.player);

        // create enemies
        for (let pos of this.enemyPositions) {
            let enemy = new Enemy(this, pos.x, pos.y, 'enemyUp', 0, pos.direction);
            this.physics.add.collider(this.player, enemy, () => {
                this.player.playerDeath();
            });
            this.physics.add.collider(enemy, this.playerProjecilesGroup, (enemy, projectile) => {
                if (!enemy.isGhost) {
                    this.collectedSouls += 1;
                    enemy.enemyDeath();
                }
                this.player.projectiles.splice(this.player.projectiles.indexOf(projectile), 1);
                projectile.destroy();
            });
            this.enemies.push(enemy);
        }

        // add tilemap to game
        const map = this.make.tilemap({ key: 'tilemap' });
        const tileset = map.addTilesetImage('tiles', 'tiles');
        this.groundLayer = map.createLayer('Walls', tileset, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);

        // collisions between map and objects
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.collider(this.playerProjecilesGroup, this.groundLayer, (projectile, ground) => {
            this.player.projectiles.splice(this.player.projectiles.indexOf(projectile), 1);
            projectile.destroy();
        }); 

        // add treasure sprite
        this.treasure = this.physics.add.staticSprite(960, 130, 'treasure', 0).setOrigin(0.5, 0.5);

        // add shrine sprite
        this.shrine = this.physics.add.staticSprite(960, 130, 'shrine', 0).setOrigin(0.5, 0.5);
        this.physics.add.collider(this.shrine, this.player, (shrine, player) => {
            if (this.collectedSouls >= 20) {
                shrine.destroy();
                this.gameWon = true;
            }
        })
        this.physics.add.collider(this.shrine, this.playerProjecilesGroup, (shrine, projectile) => {
            this.player.projectiles.splice(this.player.projectiles.indexOf(projectile), 1);
            projectile.destroy();
        });

        // add text
        this.soulsCollectedText = this.add.text(game.config.width * 3 / 2, 50, "Souls Collected: ", {color: "white"}).setOrigin(0.5, 0.5);
        this.soulsCollectedText.text = "Souls Collected: " + this.collectedSouls + " / 20";

        this.winText = this.add.text(this.game.config.width * 3 /2, 200, "", {align: "center", fontSize: 22, wordWrap: { width: 600 }}).setOrigin(0.5, 0.5);

    }

    update() {

        //console.log(game.input.mousePointer.x, game.input.mousePointer.y);

        //console.log(this.player.x, this.player.y);

        if (!this.gameWon) {
            this.soulsCollectedText.text = "Souls Collected: " + this.collectedSouls + " / 20";

            this.player.update();

            for (let enemy of this.enemies) {
                enemy.update();
            }

            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.player.spawnProjectile();
            }
        }
        else {
            this.winText.text = "You found the secret treasure hidden underneath the shrine!\n\n Press [SPACE] to restart!" 
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.scene.stop();
                this.scene.start("menuScene");
            }
        }

    }

}