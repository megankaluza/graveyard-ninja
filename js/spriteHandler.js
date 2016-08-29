// var player = {
//     pos: [0, 0],
//     sprite: new Sprite('sprites/TEST.png', [0, 0], [290, 500], 16, [0, 1])
// };
//
// function Sprite(url, pos, size, speed, frames, dir, once) {
//   this.pos = pos;
//   this.size = size;
//   this.speed =typeof speed === 'number' ? speed : 0;
//   this.frames = frames;
//   this._index = 0;
//   this.url = url;
//   this.dir = dir || 'horizontal';
//   this.once = once;
// }
//
// Sprite.prototype.render = function(ctx) {
//
//   var x = this.pos[0];
//   var y = this.pos[1];
//
//   ctx.drawImage(resources.get(this.url),
//     x, y, this.size[0], this.size[1]);
// }
