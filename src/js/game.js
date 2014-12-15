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
      //this.game.world.setBounds(0, 0, 1000, 1000);

      this.game.physics.startSystem(Phaser.Physics.P2JS);

      this.game.physics.p2.setImpactEvents(true);

      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.boxCollisionGroup = this.game.physics.p2.createCollisionGroup();

      this.game.physics.p2.updateBoundsCollisionGroup();

      // Pixel Rain
      this.boxes = this.game.add.group();
      this.boxes.enableBody = true;
      this.boxes.physicsBodyType = Phaser.Physics.P2JS;

      this.player.anchor.setTo(0.5, 0.5);
      this.player.scale.set(0.3);

      this.game.physics.p2.enable(this.player, true);
      this.player.body.kinematic = true;
      this.player.body.setCollisionGroup(this.playerCollisionGroup);
      this.player.body.collides(this.boxCollisionGroup, this.hitEnemy, this);
      this.game.physics.p2.gravity.y = 200;
      
      this.velocity = 100;
      this.index = 0;
      //this.outOfBoundsKill = true;
      //this.checkWorldBounds = true;
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
        this.addEnemy('blue');
      }
      
    },
    addEnemy: function (c) {
      var color = c;
      var x = Math.floor((Math.random() * this.game.width));
      var box = this.boxes.create(x, this.game.height-500, color);
      box.body.setRectangle(20, 20);
      box.scale.set(0.2);

      box.body.setCollisionGroup(this.boxCollisionGroup);
      box.body.collides([this.boxCollisionGroup, this.playerCollisionGroup]);
      box.body.collideWorldBounds = false;
    },
    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['pixelrain'] = window['pixelrain'] || {};
  window['pixelrain'].Game = Game;

}());
