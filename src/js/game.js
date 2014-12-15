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
      this.generateRate = 0;
      //this.outOfBoundsKill = true;
      this.checkWorldBounds = true;
      this.maxPool = 1000;

      this.input.onDown.add(this.onDown, this);
    },

    update: function () {
      var x, y, cx, cy, angle;

      x = this.input.position.x;
      y = this.input.position.y;
      cx = this.world.centerX;
      cy = this.world.centerY;

      angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);

      this.generateRate++;
      if(this.generateRate === 10) {
        this.randomBox(x, this.game.height - 500, angle);
        this.generateRate = 0;
      }
      
    },

    randomBox: function (x, y, angle) {

      var rndX = x + this.game.rnd.integerInRange(-10, 10),
          rndY = y + this.game.rnd.integerInRange(-10, 10),
          c = this.game.rnd.integerInRange(1, 3),
          color = 'blue';

      if(c === 1) {
        color = 'red';
      }
      else if(c === 2) {
        color = 'green';
      }

      this.addBox(color, rndX, angle, rndY);

    },

    addBox: function (c, mx, a, my) {

      if(this.maxPool < this.boxes.countLiving()){
        return;
      }
      var color = c;
     
      var box = this.boxes.create(mx, my, color);
      box.body.setRectangle(10, 10);
      //box.scale.set(1);
      box.angle = a;

      box.body.setCollisionGroup(this.boxCollisionGroup);
      box.body.collides([this.boxCollisionGroup, this.playerCollisionGroup]);
      box.body.collideWorldBounds = true;
    },

    onDown: function () {

      var x = this.input.position.x,
          y = this.input.position.y,
          boxesPerClick = 20;

      for (var i = 0; i < boxesPerClick; i++) {
        this.randomBox(x, y, 0);
      };

      var radius = 200,
          mass = 1,
          force = 5,
          //create a circle where the user has clicked
          //that will act as the explosion radius
          circle = new Phaser.Circle(this.input.position.x, this.input.position.y, radius);

      this.boxes.forEach(function(box) {
        //check if the box is inside the circle
        if(circle.contains(box.position.x, box.position.y)){
          
          var distance = box.position.distance(circle), //get distance from the box to the circle
              angle = box.position.angle(circle); //get angle

          //add velocity prototional to the distance of the explosion
          box.body.velocity.x += Math.cos(angle) * ((radius - distance) / mass) * force;
          box.body.velocity.y += Math.sin(angle) * ((radius - distance) / mass) * force;
        }
      }, this);
    }

  };

  window['pixelrain'] = window['pixelrain'] || {};
  window['pixelrain'].Game = Game;

}());
