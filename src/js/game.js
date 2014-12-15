(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2
        , i;

      // Use the logo as player
      this.player = this.add.sprite(x, y, 'player');
      this.player.anchor.setTo(0.5, 0.5);
      //this.input.onDown.add(this.onInputDown, this);

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);

      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.boxCollisionGroup = this.game.physics.p2.createCollisionGroup();

      this.game.physics.p2.updateBoundsCollisionGroup();

      // Pixel Rain
      this.boxes = this.game.add.group();
      this.boxes.enableBody = true;
      this.boxes.physicsBodyType = Phaser.Physics.P2JS;

      for (i = 0; i < 30; i++){

          var color = 'blue';

          if(i%2){
            color = 'red';
          }
          else if(i%3){
            color = 'green';
          }


          var box = this.boxes.create(x, y*20, color);
          box.body.setRectangle(20, 20);
          box.scale.set(0.2);

          box.body.setCollisionGroup(this.boxCollisionGroup);
          box.body.collides([this.boxCollisionGroup, this.playerCollisionGroup]);
      }

      this.player.anchor.setTo(0.5, 0.5);
      this.player.scale.set(0.3);

      this.game.physics.p2.enable(this.player, true);
      this.player.body.kinematic = true;

      this.player.body.setCollisionGroup(this.playerCollisionGroup);

      //  The ship will collide with the boxes, and when it strikes one the hitbox callback will fire, causing it to alpha out a bit
      //  When boxes collide with each other, nothing happens to them.
      this.player.body.collides(this.boxCollisionGroup, this.hitEnemy, this);
      this.game.physics.p2.gravity.y = 500;
      this.index = 0;
    },

    update: function () {
      /*var x, y, cx, cy, dx, dy, angle, scale;

      x = this.input.position.x;
      y = this.input.position.y;
      cx = this.world.centerX;
      cy = this.world.centerY;

      angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      this.player.angle = angle;

      dx = x - cx;
      dy = y - cy;
      scale = Math.sqrt(dx * dx + dy * dy) / 100;

      this.player.scale.x = scale * 0.6;
      this.player.scale.y = scale * 0.6;*/

      this.index++;
      if(this.index === 20) {
        this.index = 0;
        this.addEnemy();
      }
      
    },
    addEnemy: function () {
      var color = 'blue';

      var box = this.boxes.create(this.game.width / 2, this.game.height*10, color);
          box.body.setRectangle(20, 20);
          box.scale.set(0.2);

          box.body.setCollisionGroup(this.boxCollisionGroup);
          box.body.collides([this.boxCollisionGroup, this.playerCollisionGroup]);
    },
    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['pixelrain'] = window['pixelrain'] || {};
  window['pixelrain'].Game = Game;

}());
