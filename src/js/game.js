(function() {
  'use strict';

  function Game() {
    this.player = null;
  }
  Game.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      // Use the logo as player
      this.logo = this.game.add.sprite(x, y, 'player');
      this.logo.anchor.setTo(0.5, 0.5);

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);

      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.boxCollisionGroup = this.game.physics.p2.createCollisionGroup();

      this.game.physics.p2.updateBoundsCollisionGroup();

      // Pixel Rain
      this.boxes = this.game.add.group();
      this.boxes.enableBody = true;
      this.boxes.physicsBodyType = Phaser.Physics.P2JS;

      this.logo.scale.set(0.3);

      this.game.physics.p2.enable(this.logo, false);
      this.logo.body.clearShapes();
      this.logo.body.loadPolygon('physicsLogo', 'logoTrans');
      this.logo.body.kinematic = true;
      this.logo.body.setCollisionGroup(this.playerCollisionGroup);
      this.logo.body.collides(this.boxCollisionGroup, this.hitEnemy, this);
      this.game.physics.p2.gravity.y = 200;
      
      this.velocity = 100;
      this.index = 0;
      //this.outOfBoundsKill = true;
      //this.checkWorldBounds = true;
    },

    update: function () {
      var x, y, cx, cy, angle;

      x = this.input.position.x;
      y = this.input.position.y;
      cx = this.world.centerX;
      cy = this.world.centerY;

      angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      /*this.player.angle = angle;

      dx = x - cx;
      dy = y - cy;
      scale = Math.sqrt(dx * dx + dy * dy) / 100;

      this.player.scale.x = scale * 0.6;
      this.player.scale.y = scale * 0.6;*/


      this.index++;
      if(this.index === 10) {
        var c = Math.floor((Math.random() * 3) + 1);
        if(c === 1) {
          this.addEnemy('red', x, angle);
        }else if(c === 2) {
          this.addEnemy('green', x, angle);
        }else {
          this.addEnemy('blue', x, angle);
        }
        this.index = 0;
        
      }
      
    },
    addEnemy: function (c, mx, a) {
      var color = c;
      var box = this.boxes.create(mx, this.game.height-500, color);
      box.body.setRectangle(10, 10);
      box.scale.set(1);
      box.angle = a;

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
