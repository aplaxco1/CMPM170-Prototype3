class Player extends Phaser.Physics.Arcade.Sprite {

    moveSpeed = 300;
    spawnPoint = {x: 0, y: 0 };
    lastKnownDirection = "Up";
    deathCount = 0;
    offsets = [{x: 0, y: -40}, {x: 40, y: -40}, {x: -40, y: -40}, {x: 40, y: 0}, {x: -40, y: 0}, {x: -40, y: 40}, {x: 40, y: 40}, {x: 0, y: 40}];
    ghosts = [];
    canFire = true;
    projectiles = [];

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.gameScene = scene;
        this.playerSprite = scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(30, 30);
        this.body.setAllowGravity(false);
        this.spawnPoint.x = x;
        this.spawnPoint.y = y;
    }

    update() {
        this.movePlayer();
        this.ghostsFollow();
        this.fireProjectiles();
    }

    // handles movement input
    movePlayer() {
        if(cursors.left.isDown) {
            this.body.setVelocityX(-this.moveSpeed);
            this.body.setVelocityY(0);
            this.playerSprite.setTexture('playerLeft');
            this.lastKnownDirection = "Left";
        } 
        else if(cursors.right.isDown) {
            this.body.setVelocityX(this.moveSpeed);
            this.body.setVelocityY(0);
            this.playerSprite.setTexture('playerRight');
            this.lastKnownDirection = "Right";
        } 
        else if (cursors.up.isDown) {
            this.body.setVelocityY(-this.moveSpeed);
            this.body.setVelocityX(0);
            this.playerSprite.setTexture("playerUp");
            this.lastKnownDirection = "Up";
        }
        else if (cursors.down.isDown) {
            this.body.setVelocityY(this.moveSpeed);
            this.body.setVelocityX(0);
            this.playerSprite.setTexture('playerDown');
            this.lastKnownDirection = "Down";
        }
        else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
        }
    }

    // makes ghosts follow player as they move
    ghostsFollow() {
        for (let i = 0; i < this.ghosts.length; i += 1) {
            this.ghosts[i].x = this.x + this.offsets[i].x;
            this.ghosts[i].y = this.y + this.offsets[i].y;
            this.ghosts[i].setTexture('player'+this.lastKnownDirection);
        }
    }

    spawnProjectile() {
        if (this.canFire) {
            this.canFire = false;
            this.gameScene.time.delayedCall(500, this.toggleFiring, [], this);
            let newProj = new Projectile(this.gameScene, this.x, this.y, 'player-projectile', 0, this.lastKnownDirection);
            this.gameScene.playerProjecilesGroup.add(newProj);
            this.projectiles.push(newProj);
            for (let ghost of this.ghosts) {
                let proj = new Projectile(this.gameScene, ghost.x, ghost.y, 'player-projectile', 0, this.lastKnownDirection);
                proj.alpha = 0.5;
                this.gameScene.playerProjecilesGroup.add(proj); // rn ghost projectiles work the same as enemy projectiles, may want to change
                this.projectiles.push(proj);
            }
        }
    }

    toggleFiring() {
        this.canFire = true;
    }

    fireProjectiles() {
        for (let proj of this.projectiles) {
            if (Math.abs(proj.x - proj.spawnPos.x) >= proj.dist.x || Math.abs(proj.y - proj.spawnPos.y) >= proj.dist.y) {
                this.projectiles.splice(this.projectiles[this.projectiles.indexOf(proj)], 1);
                proj.destroy();
            }
            else {
                proj.update();
            }
        }
    }

    playerDeath() {
        if (this.deathCount < this.offsets.length) {
            let newGhost = this.gameScene.physics.add.sprite(this.offsets[this.deathCount].x + this.x, this.offsets[this.deathCount].y + this.y, "player"+this.lastKnownDirection, 0);
            newGhost.setScale(0.75, 0.75);
            newGhost.alpha = 0.5;
            newGhost.body.setAllowGravity(false);
            newGhost.setImmovable(true);
            this.gameScene.physics.add.collider(newGhost, this.gameScene.enemyGhostProjectilesGroup, (ghost, projectile) => {
                projectile.destroy();
            });
            this.ghosts.push(newGhost);
        }
        this.deathCount += 1;
        this.x = this.spawnPoint.x;
        this.y = this.spawnPoint.y;
    }
}