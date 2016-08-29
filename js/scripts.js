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
      width : 29,
      height : 50,
      speed: 3,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.3;

var boxes = [];
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
boxes.push({
    x: 60,
    y: 550,
    width: 120,
    height: 80
});
boxes.push({
    x: 50,
    y: 450,
    width: 60,
    height: 20
});
boxes.push({
    x: 180,
    y: 470,
    width: 280,
    height: 10
});
boxes.push({
    x: 250,
    y: 510,
    width: 200,
    height: 10
});
boxes.push({
    x: 180,
    y: 370,
    width: 280,
    height: 40
});

canvas.width = width;
canvas.height = height;

function update(){
  //check keys
  if (keys[38] || keys[32] || keys[87]) {
    //up arrow or space

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
  ctx.fillStyle = "green";
  ctx.beginPath();

  player.grounded = false;
  for(var i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
    var dir = colCheck(player, boxes[i]);
    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping =  false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if  (dir === "t") {
      player.velY *= -1;
    }
  }

  if (player.grounded) {
    player.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  ctx.fill();



  ctx.drawImage(document.getElementById("testSprite"), player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
      vY = (shapeA.y +(shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
      hWidths = (shapeA.width / 2) + (shapeB.width / 2),
      hHeights = (shapeA.height / 2) + (shapeB.height / 2),
      colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
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
