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
var audio_appear = new Audio('sfx/whoosh.wav');
var audio_win = new Audio('sfx/kazoo.wav');
// var music = new Audio('sfx/horrorMusic.wav');

//////// not front end because nubs, but should be....

var friction = 0.75;
var gravity = 0.5;
var keys = [];
var boxes = [];
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
  // x: 40,  //start point
  // y : 550,
  // x: 1275,  // middle mound
  // y : 350,
  x: 400, //hi clouds
  y: 100,
  // x: 1400, // last cloud jump
  // y: 175,
  width : 100 * .8,
  height : 136 * .8,
  maxSpeed: 8,
  // jumpHeight: 15,
  jumpHeight: 13,
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
  // boxes.push(new Object(0, height-10, width/2, 10)); // floor
  deathTriggers.push(new Object(0, height+136, width, 10)); // DEATH floor
  deathTriggers.push(new Object(580, 910, 60, 60));;
  deathTriggers.push(new Object(1020, 493, 70, 110));
  deathTriggers.push(new Object(1410, 355, (70 * .8), (130 * .8)));
  boxes.push(new Object(0, 0, 10, height)); // left wall
  boxes.push(new Object(width-10, 0, 10, height)); // right wall
  winTrigger = new Object(1410, 740, (32 * .95), (160 * .95));

  //crates
  crates.push(new Object(520, 910, 60, 60)); // top-left
  crates.push(new Object(520, 970, 60, 60)); //bottom-left
  crates.push(new Object(580, 970, 60, 60)); //bottom-right
  crates.push(new Object(1245, 535, 60, 60)); //on mound

  //clouds
  clouds.push(new Object(15, 475, 150, 55)); //left
  clouds.push(new Object(345, 340, 150, 55)); //mid
  clouds.push(new Object(495, 340, 150, 55)); //right

  //tombstones
  tombstones.push(new Object(270, 930, 75, 100));

  //ledges
  ledges_2.push(new Object(695, 765, 120, 35)); //low-mid
  ledges_2.push(new Object(345, 630, 160, 35)); //high-left
  ledges_5.push(new Object(1010, 593, 430, 55)); //big-right

  //spikes
  // all_spikes.push(new Object(275, 960, 70, 110));
  all_spikes.push(new Object(580, 910, 60, 60)); // bottom-left
  all_spikes.push(new Object(1020, 493, 70, 110)); //middle
  all_spikes.push(new Object(1410, 355, (70 * .8), (130 * .8))); //in tree


  //trees
  trees.push(new Object(1295, 395, 185, 200));

  //starting grounded
  ground_level.push(new Object(0, 1030, 645, 55));

  //mounds
  mounds.push(new Object(1100, 894, (486 * .75), (256 * .75)));

  //columns
  columns.push(new Object(1180, 649, (486 * .45), (256 * 1)));
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
  var allObjects = [boxes, crates, tombstones, trees, clouds, columns, mounds, ledges_2, ledges_5, all_spikes, ground_level];

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
  for(var i = 0; i < trees.length; i++) {
    var tree = document.getElementById("tree");
    ctx.drawImage(tree, trees[i].x, trees[i].y, trees[i].width, trees[i].height);
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
