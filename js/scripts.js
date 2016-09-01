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
var audio_click = new Audio('sfx/click.wav');
var audio_die = new Audio('sfx/scream.wav');
var audio_win = new Audio('sfx/win-sound.wav');
// var music = new Audio('sfx/horrorMusic.wav');

//////// not front end because nubs, but should be....

var friction = 0.75;
var gravity = 0.5;
var keys = [];
var invisWalls = [];
var all_spikes = [];
var crates = [];
var clouds = [];
var tombstones = [];
var trees = [];
var ledges_2 = [];
var ledges_5 = [];
var mounds = [];
var columns = [];
var ground_level = [];
var deathTriggers = [];
var sword;
var winTrigger;
var gameOver = false;
var won = false;
var player = {
  x: 40,  //start point
  y : 550,
  // x: 1275,  // middle mound
  // y : 350,
  // x: 400, //hi clouds
  // y: 100,
  // x: 1100, // last jump
  // y: 175,
  width : (100 * .8) -20,
  height : 136 * .8,
  maxSpeed: 8,
  // jumpHeight: 15,
  jumpHeight: 12.75,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  receivingHInput: false,
  facingRight: true,
  sprite: new Sprite('sprites/ninjaGirl_spriteSheet.png', [10, 0], [100, 136], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "horizontal", false)
};

GameObject = function (_x,_y,_width,_height) {
  this.x = _x;
  this.y = _y;
  this.width = _width;
  this.height = _height;
};


function initializeLevel() {
  // boundaries
  // invisWalls.push(new GameObject(0, height-10, width/2, 10)); // floor
  deathTriggers.push(new GameObject(0, height+136, width, 10)); // DEATH floor
  deathTriggers.push(new GameObject(580 + 10, (870 + 40), 60 - 20, (100 - 40)));
  deathTriggers.push(new GameObject(1010, (493 + 40), 70, (110 - 40)));
  deathTriggers.push(new GameObject((1420), (365 + 40), (70 * .8), ((130 * .8) - 40)));
  invisWalls.push(new GameObject(-10, 0, 10, height)); // left wall
  invisWalls.push(new GameObject(width, 0, 10, height)); // right wall
  winTrigger = new GameObject(1410, 740, (32 * .95), (160 * .95));

  //spikes
  all_spikes.push(new GameObject(580, (870 + 40), 60, (100 - 40))); // bottom-left
  all_spikes.push(new GameObject(1010, (493 + 40), 70, (110 - 40))); //middle
  all_spikes.push(new GameObject((1420), (365 + 40), (70 * .8), ((130 * .8) - 40))); //in tree

  //crates
  crates.push(new GameObject(520, 910, 60, 60)); // top-left
  crates.push(new GameObject(520, 970, 60, 60)); //bottom-left
  crates.push(new GameObject(580, 970, 60, 60)); //bottom-right
  crates.push(new GameObject(1245, 545, 60, 60)); //on mound

  //clouds
  clouds.push(new GameObject(15, (475 + 25), 150, (55 - 25))); //left
  clouds.push(new GameObject(345, (340 + 25), 150, (55 - 25))); //mid
  clouds.push(new GameObject(505, (340 + 25), 150, (55 - 25))); //right

  //tombstones
  tombstones.push(new GameObject(270, 930, 75, 100));

  //ledges
  ledges_2.push(new GameObject(695, 765, 120, 35)); //low-mid
  ledges_2.push(new GameObject(345, 630, 160, 35)); //high-left
  ledges_5.push(new GameObject(1010, 603, 430, 55)); //big-right

  //trees
  trees.push(new GameObject((1295 + 20), (405 + 40), (185 - 40), ((200 - 40) - 120))); //the-tree

  //starting grounded
  ground_level.push(new GameObject(0, 1030, 645, 55));

  //mounds
  mounds.push(new GameObject(1100, 894, (486 * .75), (256 * .75))); //middle-platform

  //columns
  columns.push(new GameObject(1180, 649, (486 * .45), (256 * 1))); //middle-column
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
  var allObjects = [invisWalls, crates, tombstones, trees, clouds, columns, mounds, ledges_2, ledges_5, all_spikes, ground_level];

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

function detectTriggers () {
  for (var i = 0; i < deathTriggers.length; i++) {
    var dir = colCheck(player, deathTriggers[i], false);
    if (dir === "b") {
      setTimeout(function(){endGame(false);},100);
    }
  }
  var direction = colCheck(player, winTrigger, false);
  if (direction === "l" || direction === "r" || direction === "t" || direction === "b") {
    setTimeout(function(){endGame(true);},200);
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

function endGame (_win) {
  if(!gameOver){
    gameOver = true;
    if (_win === true) {
      won = true;
    }
    else {
      won = false;
    }
  }
}


// Front-End //
function render() {
  //clears previous frame (whole canvas)
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath(); // DO NOT REMOVE
  // redraws static elements

  // POSSIBLE REFACTOR //
  // var arrayOfArraysToRender = [];
  // for(var index = 0; index < arrayOfArraysToRender.length; i++){
  //
  // }
  // POSSIBLE REFACTOR //

  for(var i = 0; i < invisWalls.length; i++) {
    ctx.rect(invisWalls[i].x, invisWalls[i].y, invisWalls[i].width, invisWalls[i].height);
  }
  for(var i = 0; i < crates.length; i++) {
    var crate = document.getElementById("crate");
    ctx.drawImage(crate, crates[i].x, crates[i].y, crates[i].width, crates[i].height);
  }
  for(var i = 0; i < clouds.length; i++) {
    var cloud = document.getElementById("cloud");
    ctx.drawImage(cloud, clouds[i].x, clouds[i].y - 25, clouds[i].width, (clouds[i].height + 25));
  }
  for(var i = 0; i < all_spikes.length; i++) {
    var spikes = document.getElementById("spikes");
    // ctx.rect(all_spikes[i].x, (all_spikes[i].y), all_spikes[i].width, (all_spikes[i].height));
    ctx.drawImage(spikes, all_spikes[i].x, (all_spikes[i].y - 40), all_spikes[i].width, (all_spikes[i].height + 40));
  }
  for(var i = 0; i < trees.length; i++) {
    var tree = document.getElementById("tree");
    // ctx.rect(trees[i].x, (trees[i].y), trees[i].width, (trees[i].height));
    ctx.drawImage(tree, (trees[i].x - 20), (trees[i].y - 40), (trees[i].width + 40), ((trees[i].height + 40) + 120));
  }
  for(var i = 0; i < ledges_2.length; i++) {
    var ledge2 = document.getElementById("ledge2");
    ctx.drawImage(ledge2, ledges_2[i].x, ledges_2[i].y, ledges_2[i].width, ledges_2[i].height);
  }
  for(var i = 0; i < ground_level.length; i++) {
    var ground = document.getElementById("ground");
    ctx.drawImage(ground, ground_level[i].x, ground_level[i].y, ground_level[i].width, ground_level[i].height);
  }
  for(var i = 0; i < columns.length; i++) {
    var midCol = document.getElementById("midCol");
    ctx.drawImage(midCol, columns[i].x, columns[i].y, columns[i].width, columns[i].height);
  }
  for(var i = 0; i < ledges_5.length; i++) {
    var ledge5 = document.getElementById("ledge5");
    // ctx.rect(ledges_5[i].x, (ledges_5[i].y), ledges_5[i].width, (ledges_5[i].height));
    ctx.drawImage(ledge5, ledges_5[i].x, ledges_5[i].y, ledges_5[i].width, ledges_5[i].height);
  }
  for(var i = 0; i < mounds.length; i++) {
    var midMound = document.getElementById("mid-mound");
    ctx.drawImage(midMound, mounds[i].x, mounds[i].y, mounds[i].width, mounds[i].height);
  }
  for(var i = 0; i < tombstones.length; i++) {
    var tombstone = document.getElementById("tombstone");
    ctx.drawImage(tombstone, tombstones[i].x, tombstones[i].y, tombstones[i].width, tombstones[i].height);
  }

  var sign = document.getElementById("bewaresign");
  ctx.drawImage(sign,1110,805,(91 * .75),(95 * .95));

  var skeleton = document.getElementById("skeleton");
  ctx.drawImage(skeleton,1145, 550, (95 * .9), (60 * .9));

  var sword = document.getElementById("sword");
  // ctx.drawImage(sword,1410,740,(32 * .95),(160 * .95));
  ctx.drawImage(sword, winTrigger.x, winTrigger.y, winTrigger.width, winTrigger.height);
  ctx.fillStyle = "#85929E";
  ctx.fill();

  // redraws character

  // ctx.drawImage(document.getElementById("testSprite"), player.x, player.y, player.width, player.height);

}

$(document).ready(function(){
  $("button#startButton").click(function() {
    audio_click.volume = 0.5;
    audio_click.play();
    initializeLevel();
    update();
    $("#startScreen").hide();
    $("canvas#canvas").css("display", "block");
  });
});

$("button.reloadButton").click(function(){
  location.reload();
  audio_click.volume = 0.5;
  audio_click.play();
});

function drawEndScreen (){
  $("#canvas").hide();
  if(won){
    $("#winScreen").css("display", "block");
    audio_win.volume = 0.2;
    audio_win.play();
  }
  else {
    $("#dieScreen").css("display", "block");
    audio_die.volume = 0.2;
    audio_die.play();
  }
}

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
