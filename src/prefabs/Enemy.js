class Enemy extends Phaser.Physics.Arcade.Sprite {

    direction = "Up";
    canFire = true;
    isGhost = false;
    projectiles = [];

    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);
        this.gameScene = scene;
        this.enemySprite = scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(30, 30);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true)
        this.direction = direction;
        this.enemySprite.setTexture('enemy'+this.direction);
    }

    update() {
        this.spawnProjectile();
        this.fireProjectiles();
    }

    spawnProjectile() {
        if (this.canFire) {
            this.canFire = false;
            this.gameScene.time.delayedCall(1500, this.toggleFiring, [], this);
            let newProj = new Projectile(this.gameScene, this.x, this.y, 'enemy-projectile', 0, this.direction);
            this.gameScene.physics.add.collider(newProj, this.gameScene.groundLayer, (p, ground) => {
                this.projectiles.splice(this.projectiles[this.projectiles.indexOf(p)], 1);
                p.destroy();
            }); 
            if (this.isGhost) {
                newProj.alpha = 0.5;
                this.gameScene.enemyGhostProjectilesGroup.add(newProj);
            }
            else {
                this.gameScene.enemyProjectilesGroup.add(newProj);
            }
            this.projectiles.push(newProj);
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

    enemyDeath() {
        this.isGhost = true;
        this.enemySprite.alpha = 0.5;
        for (let proj of this.projectiles) {
            proj.destroy();
        }
        this.projectiles = [];
        // this.destroy();
    }
}