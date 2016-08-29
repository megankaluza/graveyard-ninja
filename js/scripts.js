(function() {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 800,
    height = 600,
    player = {
      x : width/2,
      y : height - 5,
      width : 5,
      height : 5,
      speed: 3,
      velX: 0,
      velY: 0,
      jumping: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.3;

var boxes = []
//dimensions
boxes.push({
  x: 0,
  y:0,
  width: 10,
  height: height
});
boxes.push({
  x: 0,
  y: height - 2,
  width: width,
  height: 50
});
boxes.push({
  x: width - 10,
  y: 0,
  width: 50,
  height: height
});

canvas.width = width;
canvas.height = height;

function update(){
  //check keys
  if (keys[38] || keys[32]) {
    //up arrow
    if(!player.jumping){
      player.jumping = true;
      player.velY = -player.speed*2;
    }
  }
  if (keys[39]) {
    //right arrow
    if (player.velX < player.speed) {
      player.velX++;
    }
  }
  if (keys[37]) {
    //left arrow
    if (player.velX > -player.speed) {
      player.velX--;
    }
  }
  player.x += player.velX;
  player.y += player.velY;

  if (player.x >= width-player.width){
      player.x = width-player.width;
  } else if (player.x <= 0) {
      player.x = 0;
  }

  if(player.y >= height-player.height){
    player.y = height - player.height;
    player.jumping = false;
  }

  player.velX *= friction;
  player.velY += gravity;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "black";
  ctx.beginPath();

  for(var i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
  }
  ctx.fill();

  ctx.fillStyle = "pink";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  requestAnimationFrame(update);
};

function colCheck(shapeA, shapeB) {
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
      vY = (shapeA.y +(shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
      hWidths = (shapeA.width / 2) + (shapeB.width / 2),
      hHeights = (shapeA.height / 2) + (shapeB.height / 2),
      colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    if (vY > 0) {
      colDir = "t";
      shapeA.y += oY;
    } else {
      colDir = "b";
      shapeA.y -= oY;
    }
  } else {
    if (vX > 0) {
      colDir = "l";
      shapeA.x += oX;
    } else {
      colDir = "r";
      shapeA.x -+ oX;
    }
  }
  return colDir;
}

document.body.addEventListener("keydown", function(e){
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e){
  keys[e.keyCode] = false;
});

window.addEventListener("load", function(){
  update();
});
