// var player = {
//     pos: [0, 0],
//     sprite: new Sprite('sprites/ninjaGirl_jumpCycle.png', [0, 0], [100, 136], 30, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "horizontal", false)
// };

function Sprite(url, pos, size, speed, frames, dir, once) {
  this.pos = pos;
  this.size = size;
  this.speed = typeof speed === 'number' ? speed : 0;
  this.frames = frames;
  this.index = 0;
  this.url = url;
  this.dir = dir || 'horizontal';
  this.once = once;
  this.done = false;
}

Sprite.prototype.update = function(_dt) {
  if(!_dt){
    _dt = 0;
  }
  this.index += this.speed * _dt;
};

Sprite.prototype.render = function(_ctx) {
  var frame;

  if(this.speed > 0) {
    var max = this.frames.length;
    var idx = Math.floor(this.index);
    frame = this.frames[idx % max];

    if(this.once && idx >= max) {
      this.done = true;
      // return;
    }
  }
  else {
    frame = 0;
  }

  var x = this.pos[0];
  var y = this.pos[1];

  if(this.dir == 'vertical') {
    y += frame * (this.size[1] + 14);
  }
  else {
    x += frame * (this.size[0] + 20);
  }

  _ctx.drawImage(document.getElementById("testAnim"),
                x, y, this.size[0], this.size[1],
                player.x, player.y, player.width + 20, player.height);


};
