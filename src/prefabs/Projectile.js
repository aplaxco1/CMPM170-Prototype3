class Projectile extends Phaser.Physics.Arcade.Sprite {

    moveSpeed = 500;
    dist = {x: game.config.width *  3, y: game.config.height * 3 }
    spawnPos = {x:  0, y: 0};
    projVelocity = {x: 0, y: 0};

    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.spawnPos.x = x;
        this.spawnPos.y = y;
        if (direction == "Up") {
            this.projVelocity.y = -this.moveSpeed;
        }
        else if (direction == "Right") {
            this.projVelocity.x = this.moveSpeed;
        }
        else if (direction == "Left") {
            this.projVelocity.x = -this.moveSpeed;
        }
        else if (direction == "Down") {
            this.projVelocity.y = this.moveSpeed
        }
    }

    update() {
        if (this.body) {
            this.body.setVelocityX(this.projVelocity.x);
            this.body.setVelocityY(this.projVelocity.y);
        }
    }
}