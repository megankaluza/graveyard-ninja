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
    width = 500,
    height = 200,
    player = {
      x : width/2,
      y : height - 10,
      width : 5,
      height : 5,
      speed: 3,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.3;

var boxes= [];

boxes.push({
  x: 0,
  y: 0,
  width: 10,
  height: height
});
boxes.push({
  x: 0,
  y: height-2,
  width: width,
  height: 2,
  height: height
});
boxes.push({
  x: width - 10,
  y: 0,
  width: 10,
  height: height
});
boxes.push({
    x: 120,
    y: 10,
    width: 80,
    height: 80
  });
boxes.push({
    x: 170,
    y: 50,
    width: 80,
    height: 80
});
boxes.push({
    x: 220,
    y: 100,
    width: 80,
    height: 80
});
boxes.push({
    x: 270,
    y: 150,
    width: 40,
    height: 40
});

canvas.width = width;
canvas.height = height;

function update(){
  //check keys
  if (keys[38] || keys[32] || keys[87]) {
    //up arrow
    if(!player.jumping && player.grounded){
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed*2;
    }
  }
  if (keys[39] || keys[68]) {
    //right arrow
    if (player.velX < player.speed) {
      player.velX++;
    }
  }
  if (keys[37] || keys[65]) {
    //left arrow
    if (player.velX > -player.speed) {
      player.velX--;
    }
  }

  player.velX *= friction;
  player.velY += gravity;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "black";
  ctx.beginPath();

  player.grounded = false;
  for (var i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    var dir = colCheck(player, boxes[i]);

    if(dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    }
    else if(dir  === "b") {
      player.grounded = true;
      player.jumping = false;
    }
    else if (dir === "t"){
      player.velY *= -1;
    }
  }

  if(player.grounded){
    player.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  ctx.fill();
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  var vX = (shapeA.x + (shapeA.width/2))
            - (shapeB.x + (shapeB.width/2)),
      vY = (shapeA.y + (shapeA.height/2))
            - (shapeB.y + (shapeB.height/2)),
      hWidths = (shapeA.width/2) + (shapeB.width/2),
      hHeights = (shapeA.height/2) + (shapeB.height/2),
      colDir = null;

  if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeights){
    var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
    if(oX >= oY) {
      if(vY > 0){
        colDir = "t";
        shapeA.y += oY;
      } else{
        coldDir = "b";
        shapeA.y -= oY;
      }
    } else {
      if(vX > 0){
        colDir = "l";
        shapeA.x += oX;
      } else{
        coldDir = "r";
        shapeA.x -= oX;
      }
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
