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
    y : height - 5,
    width : 5,
    height : 5,
    speed: 3,
    velX: 0,
    velY: 0,
    jumping : false
  },
  keys = [],
  friction = 0.8,
  gravity = 0.3;

canvas.width = width;
canvas.height = height;

function update() {
  if (keys[38]) {
  }
  if (keys[39]) {
    if (player.velX < player.speed) {
      player.velX++;
    }
  }if (keys[37]) {
    if (player.velX > -player.speed) {
      player.velX--;
    }
  }
  if (keys[38] || keys[32]) {
    if (!player.jumping) {
      player.jumping = true;
      player.velY = -player.speed*2;
    }
  }
  player.velX *= friction;

  player.velY += gravity;

  player.x += player.velX;
  player.y += player.velY;

  if (player.x >= width-player.width) {
    player.x = width-player.width;
  }
  else if (player.x <= 0) {
    player.x = 0;
  }

  if (player.y >= height-player.height) {
    player.y = height - player.height;
    player.jumping = false; 
  }

  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  requestAnimationFrame(update);
}

document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

window.addEventListener("load", function(){
  update();
});
