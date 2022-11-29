// define variables
var game;
var player;
var evil;
var chimneys;
var badges;
var birds;
var cursors;
var jumpButton;
var text;
var won = false;
var currentScore = 0;
var winningScore = 100;



console.log("Im game");

// add birds 
function addItems() {
  birds = game.add.physicsGroup();
    // createItem(120,60, 'smarty' );
    // createItem(780,180, 'smarty' ); 
    // createItem(870, 365,'beaker');
    // createItem(285, 365, 'beaker');
    createItem(194,528,'ditsy');
    createItem(294,428,'ditsy');
    createItem(374,278,'ditsy');
    createItem(510,340,'ditsy');
   
}

// add chimneys
function addChimneys() {
   chimneys = game.add.physicsGroup();
      //LEFT
    chimneys.create(194,518,'chimney');
    chimneys.create(294,418,'bigChimney');
    chimneys.create(374,268,'bigChimney');
    chimneys.create(510,330,'bigChimney');
    //RIGHT
    chimneys.create(620,18,'highChimney');
    chimneys.create(730,418,'bigChimney'); 
    chimneys.create(770,268,'bigChimney');
    chimneys.create(790,318,'bigChimney'); 
    chimneys.create(870,418,'bigChimney'); 
    
    chimneys.setAll('body.immovable', true);
}
// create a single animated item and add to screen
function createItem(left, top, image) {
  var bird = birds.create(left, top, image);
   bird.animations.add('spin'); 
   bird.animations.play('spin',10, true); 
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(200, 0, 'badge');

}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  currentScore = currentScore + 10;
  if (currentScore === winningScore) {
      createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(1200, 675, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
      
  // before the game begins
  function preload() {
    //automatically scale to different screen sizes
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;  
    //load level  
    game.stage.backgroundColor = '#37235a';
    game.load.image('background', 'img/background.png');
    game.load.image('chimney','img/chimney.png');  
    game.load.image('lowChimney','img/low_chimney.png');  
    game.load.image('highChimney','img/tall_chimney.png'); 
    game.load.image('bigChimney','img/bigChimney.png');
      
    game.load.image('gameover', 'img/game_over.png');
     
    //add players
    game.load.spritesheet('player', 'img/whiteCat.png', 100, 65);
    game.load.spritesheet('evil', 'img/blackCat.png', 100, 65);
      
    //add birds sprites
    game.load.spritesheet('ditsy', 'img/sprites/ditsy.png', 40, 50);
    // game.load.spritesheet('baldie', 'img/sprites/baldie.png', 60, 60);
    // game.load.spritesheet('smarty','img/sprites/smarty_pants.png',80, 63);
    // game.load.spritesheet('beaker','img/sprites/beaker.png', 82, 60);
      
    game.load.image('badge', 'img/badge.png', 675, 675);
      
//    //load sounds  
//    game.load.audio('chirping','sounds/bird.mp3');
//    game.load.audio('bang','sounds/bang.mp3');
//    game.load.audio('fall','sounds/fall.mp3');
       
  }
  // initial game set up
  function create() { 
           
    this.add.image(0, 0, 'background');
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 0.5);    
    game.physics.arcade.enable(player);  
    player.body.collideWorldBounds = true;   
           
    evil = game.add.sprite(1100, 600, 'evil');
    evil.animations.add('walk');
    evil.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(evil);  
    evil.body.collideWorldBounds = true;
      
     addItems(); 
     addChimneys(); 
   
    //disable some collisons : left
    game.physics.arcade.checkCollision.left = false;  
    game.physics.arcade.checkCollision.right = false;  
     
      //GAME OVER WHEN OUT OF BOUNDs
        player.checkWorldBounds = true;
        player.events.onOutOfBounds.add(function(){             
//            alert('Game over!');
              this.add.image(0, 0, 'gameover');
              game.time.events.add(Phaser.Timer.SECOND * 4, fadePicture, this);
        location.reload();
        }, this);
        
      function fadePicture() {
    game.add.tween(picture).to( { alpha: 0 }, 25000, Phaser.Easing.Linear.None, true);

}

//      addItems(); 
//     addChimneys(); 
          
    player.body.gravity.y = 500;
    evil.body.gravity.y = 500;
    // evil.body.bounce.set(1);   
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
  }
  
  // while the game is running add collisions and overlaps
  function update() { 
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, chimneys);
    game.physics.arcade.overlap(player, birds, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
     //Evil movement
     var random =  game.rnd.integerInRange(100, 300);   
     
     game.physics.arcade.collide(evil, chimneys);
     game.physics.arcade.overlap(evil, birds, itemHandler);
     game.physics.arcade.overlap(evil, badges, badgeHandler);
     evil.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      evil.animations.play('walk', 10, true);
//      evil.body.velocity.x = 300;
      evil.body.velocity.x = random;
      evil.scale.x = 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      evil.animations.play('walk', 10, true);
      evil.body.velocity.x = random - 400;
      evil.scale.x = -1;
    }
    // player doesn't move
    else {
      evil.animations.stop();
    }
    
    if (jumpButton.isDown && (evil.body.onFloor() || evil.body.touching.down)) {
      evil.body.velocity.y = -550;
    }  
              
  }

  function render() {

  }

};
