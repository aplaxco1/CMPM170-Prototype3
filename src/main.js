
let config = {
    type: Phaser.AUTO,
    width: 640,
    backgroundColor: '#2A253E',
    height: 480,
    scene: [Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
}

let game = new Phaser.Game(config);


// global variables

// reserve keyboard
let cursors, keySPACE, keyF;

//adjustable game settings. 
game.settings = {
}