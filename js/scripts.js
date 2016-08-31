// Back-End

(function() {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var lastTime;

//////// not front end because nubs, but should be....
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 1889;
var height = 1080;

canvas.width = width;
canvas.height = height;

var audio_jump = new Audio('sfx/jump.wav');
// var music = new Audio('sfx/horrorMusic.wav');

//////// not front end because nubs, but should be....

var friction = 0.75;
var gravity = 0.5;
var keys = [];
var boxes = [];
var all_spikes = [];
var crates = [];
var clouds = [];
var ledges_2 = [];
// var mounds = [];
var ground_level = [];
var deathTriggers = [];
var winTrigger;
var gameOver = false;
var won = false;
var player = {
  x: 40,
  y : 550,
  width : 100 * .8,
  height : 136 * .8,
  maxSpeed: 8,
  jumpHeight: 30,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  receivingHInput: false,
  facingRight: true,
  sprite: new Sprite('sprites/ninjaGirl_spriteSheet.png', [10, 0], [100, 136], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "horizontal", false)
};

Object = function (_x,_y,_width,_height) {
  this.x = _x;
  this.y = _y;
  this.width = _width;
  this.height = _height;
};


function initializeLevel() {
  // boundaries
  boxes.push(new Object(0, height-10, width/2, 10)); // floor
  deathTriggers.push(new Object(width/2, height+136, width/2, 10)); // DEATH floor
  boxes.push(new Object(0, 0, 10, height)); // left wall
  boxes.push(new Object(width-10, 0, 10, height)); // right wall
  winTrigger = new Object(1200,850,40,40);

  //crates
  crates.push(new Object(520, 910, 60, 60)); //1
  crates.push(new Object(580, 910, 60, 60)); //2
  crates.push(new Object(520, 970, 60, 60)); //3
  crates.push(new Object(580, 970, 60, 60)); //4

  //clouds
  clouds.push(new Object(10, 460, 150, 60));
  clouds.push(new Object(325, 340, 150, 60));

  //ledges
  ledges_2.push(new Object(675, 775, 120, 35));
  ledges_2.push(new Object(345, 630, 160, 35));

  //spikes
  all_spikes.push(new Object(275, 960, 70, 110));

  //starting grounded
  ground_level.push(new Object(0, 1030, 645, 55));
}

function update(){
  if(!gameOver){
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    getInput();
    movePlayer();
    detectTriggers();
    detectCollisions();
    render();

    player.sprite.update(dt);
    player.sprite.render(ctx);

    lastTime = now;

    requestAnimationFrame(update);
  }
  else {
    drawEndScreen();
  }
}

function drawEndScreen (){
  ctx.clearRect(0, 0, width, height);
  ctx.rect(200, 100, width-400, height-200);
  if(won){
    ctx.fillStyle = "skyblue";
    ctx.fill();
    ctx.fillStyle = "papayawhip";
    ctx.font="200px Ravi Prakash";
    ctx.fillText("You win!", 540, 400);
    ctx.font="60px Ravi Prakash";
    ctx.fillText("You have guided [name] to the magical kunai", 400, 600);
    ctx.fillText("of her ancestors!", 700, 675);
  }
  else {
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "crimson";
    ctx.font="200px Ravi Prakash";
    ctx.fillText("You lose.", 540, 400);
    ctx.font="60px Ravi Prakash";
    ctx.fillText("You have killed [name]!", 625, 600);
    ctx.fillText("Now she can never prevent the undead apocalypse!", 325, 675);
    ctx.fillText("You have doomed us all!", 620, 750);
  }
}


function getInput(){
  if (keys[38] || keys[32] || keys[87]) { // vertical
    //38 === up arrow; 32 === spacebar; 87 === w
    if(!player.jumping && player.grounded){
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.jumpHeight;
      audio_jump.volume = 0.2;
      audio_jump.play();
    }
  }

  if (keys[39] || keys[68] || keys[37] || keys[65]) { // horizontal
    //38 === right arrow; 32 === d; 37 === left arrow; 65 === a;
    if(keys[39] || keys[68]) { // if right
      if (player.velX < player.maxSpeed) {
        player.velX++;
        player.facingRight = true;
      }
    }
    else { // if left
      if (player.velX > -player.maxSpeed) {
        player.velX--;
        player.facingRight = false;
      }
    }
    player.receivingHInput = true;
  }
  else {
    player.receivingHInput = false;
  }
}

function movePlayer(){
  if(!player.receivingHInput){
    player.velX *= friction;
  }
  if(Math.abs(player.velX) < 0.2){
    player.velX = 0;
    if(player.grounded) {
      if(player.facingRight) {
        player.sprite.pos = [10,0];
      }
      else {
        player.sprite.pos = [10,450];
      }
      player.sprite.once = false;
    }
  }
  else {
    if(player.grounded) {
      if(player.facingRight) {
        player.sprite.pos = [1,150];
      }
      else {
        player.sprite.pos = [1,600];
      }
      player.sprite.once = false;
    }
  }
  player.x += player.velX;

  player.velY += gravity;
  if (player.grounded) {
    player.velY = 0;
  }
  else {
    if(player.facingRight) {
      player.sprite.pos = [0,300];
    }
    else {
      player.sprite.pos = [0,750];
    }
    player.sprite.once = true;
  }
  player.grounded = false;
  player.y += player.velY;
}

function detectCollisions(){
  var allObjects = [boxes, crates, clouds, ledges_2, all_spikes, ground_level];

  for(var index = 0; index < allObjects.length; index++){
    for(var i = 0; i < allObjects[index].length; i++) {
      var dir = colCheck(player, allObjects[index][i], true);
      if (dir === "l" || dir === "r") {
        player.velX = 0;
      } else if (dir === "b") {
        player.grounded = true;
        player.jumping = false;
      } else if  (dir === "t") {
        player.velY *= -0.5;
      }
    }
  }
}

function endGame (_win) {
  if(!gameOver){
    gameOver = true;
    if (_win === true) {
      won = true;
      console.log("You win!");
    }
    else {
      won = false;
      console.log("You died!");
    }
  }
}

function detectTriggers () {
  for (var i = 0; i < deathTriggers.length; i++) {
    var dir = colCheck(player, deathTriggers[i], false);
    if (dir === "l" || dir === "r") {
      endGame(false);
    } else if (dir === "b") {
      endGame(false);
    } else if (dir === "t") {
      endGame(false);
    }
  }
  var direction = colCheck(player, winTrigger, false);
  if (direction === "l" || direction === "r" || direction === "t" || direction === "b") {
    endGame(true);
  }
}

function colCheck(_shapeA, _shapeB, _hasCollision) {
  var vX = (_shapeA.x + (_shapeA.width / 2)) - (_shapeB.x + (_shapeB.width / 2));
  var vY = (_shapeA.y +(_shapeA.height / 2)) - (_shapeB.y + (_shapeB.height / 2));
  var hWidths = (_shapeA.width / 2) + (_shapeB.width / 2);
  var hHeights = (_shapeA.height / 2) + (_shapeB.height / 2);
  var colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    var oX = hWidths - Math.abs(vX);
    var oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        if(_hasCollision){
          _shapeA.y += oY;
        }
      }
      else {
        colDir = "b";
        if(_hasCollision){
          _shapeA.y -= oY;
        }
      }
    }
    else {
      if (vX > 0) {
        colDir = "l";
        if(_hasCollision){
          _shapeA.x += oX;
        }
      }
      else {
        colDir = "r";
        if(_hasCollision){
          _shapeA.x -= oX;
        }
      }
    }
  }

  return colDir;
}


// Front-End //
function render() {
  //clears previous frame (whole canvas)
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath(); // DO NOT REMOVE
  // redraws static elements
  for(var i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
  }
  for(var i = 0; i < crates.length; i++) {
    var crate = document.getElementById("crate");
    ctx.drawImage(crate, crates[i].x, crates[i].y, crates[i].width, crates[i].height);
  }
  for(var i = 0; i < clouds.length; i++) {
    var cloud = document.getElementById("cloud");
    ctx.drawImage(cloud, clouds[i].x, clouds[i].y, clouds[i].width, clouds[i].height);
  }
  for(var i = 0; i < all_spikes.length; i++) {
    var spikes = document.getElementById("spikes");
    ctx.drawImage(spikes, all_spikes[i].x, all_spikes[i].y, all_spikes[i].width, all_spikes[i].height);
  }
  for(var i = 0; i < ledges_2.length; i++) {
    var ledge2 = document.getElementById("ledge2");
    ctx.drawImage(ledge2, ledges_2[i].x, ledges_2[i].y, ledges_2[i].width, ledges_2[i].height);
  }
  for(var i = 0; i < ground_level.length; i++) {
    var ground = document.getElementById("ground");
    ctx.drawImage(ground, ground_level[i].x, ground_level[i].y, ground_level[i].width, ground_level[i].height);
  }

  ctx.rect(winTrigger.x, winTrigger.y, winTrigger.width, winTrigger.height);
  ctx.fillStyle = "#85929E";
  ctx.fill();

  // redraws character

  // ctx.drawImage(document.getElementById("testSprite"), player.x, player.y, player.width, player.height);

}

$(document).ready(function(){
  initializeLevel();
  update();
  $("#musicPlayer").play;
});

$("body").keydown(function(event){
  keys[event.keyCode] = true;
});
$("body").keyup(function(event){
  keys[event.keyCode] = false;
});

window.addEventListener("keydown", function(event) {
  // space and arrow keys
  if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
      event.preventDefault();
  }
}, false);
