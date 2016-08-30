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
//////// not front end because nubs, but should be....

var friction = 0.75;
var gravity = 0.5;
var keys = [];
var boxes = [];
var crates = [];
var player = {
  x : width / 2,
  y : height - 100,
  width : 100,
  height : 136,
  maxSpeed: 8,
  jumpHeight: 12,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  receivingHInput: false,
  facingRight: true,
  sprite: new Sprite('sprites/ninjaGirl_spriteSheet.png', [10, 0], [100, 136], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "horizontal", false)
};

Box = function (_x,_y,_width,_height) {
  this.x = _x;
  this.y = _y;
  this.width = _width;
  this.height = _height;
};

NewCrate = function (_x,_y,_width,_height) {
  this.x = _x;
  this.y = _y;
  this.width = _width;
  this.height = _height;
};

function initializeBoxes() {
  boxes.push(new Box(0, height-10, width, 10)); // floor
  boxes.push(new Box(0, 0, 10, height)); // left wall
  boxes.push(new Box(width-10, 0, 10, height)); // right wall

  boxes.push(new Box(50, 450, 60, 20));
  boxes.push(new Box(180, 470, 280, 10));
  boxes.push(new Box(850, 870, 200, 10));
  boxes.push(new Box(180, 970, 480, 40));
}

function initializeNewCrates() {
  crates.push(new NewCrate(1200, 940, 130, 130));
}

function update(){
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  getInput();
  movePlayer();
  detectCollisions();
  render();

  player.sprite.update(dt);
  player.sprite.render(ctx);

  lastTime = now;

  requestAnimationFrame(update);
}

function getInput(){
  if (keys[38] || keys[32] || keys[87]) { // vertical
    //38 === up arrow; 32 === spacebar; 87 === w
    if(!player.jumping && player.grounded){
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.jumpHeight;
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
      // player.sprite.once = false;
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
      // player.sprite.once = false;
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
    // player.sprite.once = true;
  }
  player.y += player.velY;
}

function detectCollisions(){
  for(var i = 0; i < boxes.length; i++) {
    var dir = colCheck(player, boxes[i]);
    if (dir === "l" || dir === "r") {
      player.velX = 0;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if  (dir === "t") {
      player.velY *= -0.5;
    }
  }
  for(var i = 0; i < crates.length; i++) {
    var dir = colCheck(player, crates[i]);
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

function colCheck(_shapeA, _shapeB) {
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
        _shapeA.y += oY;
      }
      else {
        colDir = "b";
        _shapeA.y -= oY;
      }
    }
    else {
      if (vX > 0) {
        colDir = "l";
        _shapeA.x += oX;
      }
      else {
        colDir = "r";
        _shapeA.x -+ oX;
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
    // ctx.rect(crates[i].x, crates[i].y, crates[i].width, crates[i].height);
    var crate = document.getElementById("crate");
    ctx.drawImage(crate, crates[i].x, crates[i].y, crates[i].width, crates[i].height);
  }
  ctx.fillStyle = "#85929E";
  ctx.fill();
  // redraws character

  // ctx.drawImage(document.getElementById("testSprite"), player.x, player.y, player.width, player.height);

}

$(document).ready(function(){
  initializeBoxes();
  initializeNewCrates();
  update();
});

$("body").keydown(function(event){
  keys[event.keyCode] = true;
});
$("body").keyup(function(event){
  keys[event.keyCode] = false;
});
