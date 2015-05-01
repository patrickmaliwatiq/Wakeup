// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});
 
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});
 
// A Border is just an Actor with a certain color
Crafty.c('Border', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});
 
// A Wush is just an Actor with a certain color
Crafty.c('Wall', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  },
});

Crafty.c('Desk', {
  init: function() {
    this.requires('Actor, Color, Collision')
      .color('#FF0000');
  },
  recievePackage: function() {
    console.log('Drop package at:' + this.name)
  }
})

// This is the player-controlled character
Crafty.c('Amber', {
  init: function() {
    this.packages = [];
    this.requires('Actor, Fourway, Color, Collision')
      .fourway(1.75)
      .color('rgb(20, 75, 40)')
      .stopOnSolids()
      .checkHits('Package, Desk')
      .bind('HitOn', function(data) {
        var entity =  data[0].obj

        if (entity.has('Package')) {
          this.pickupPackage(data) 
        } else if (entity.has('Desk') ) {
          this.visitDesk(data);
        }
      });
  },
 
  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
 
    return this;
  },
 
  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

   // Respond to this player visiting a package
  pickupPackage: function(data) {
    var package = data[0].obj;
    this.packages.push(package);
    package.destroy();
    console.log("Picked up package for: " + package.to);
  },

  visitDesk: function(data) {
    var desk = data[0].obj;
    var owner = desk.owner;
    var package = _(this.packages).findWhere({ to: owner });
    if (package) {
      console.log("Delivered package to: " + package.to);
      this.packages = _(this.packages).reject(function(pkg) {
        return pkg.to === owner;
      });
      // TODO: Figure out how to do package management
      // Crafty.trigger('PackageDroppedOff', this);
    } else {
      console.log("You do not have a package for: " + owner);
    }
  }
});

// A package is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Package', {
  init: function() {
    this.requires('Actor, Color')
      .color('rgb(170, 125, 40)');
  }
});

Crafty.c('Packages', {
  init: function() {
    this.requires('Actor, Color, Collision')
      .color('brown')
      .checkHits('Amber')
      .bind('HitOn', function(data) {
        this.packagePickupMode = true;
        Crafty.trigger('ChoosePackages');
      })
      .bind('HitOff', function(data) {
        Crafty.trigger('UnchoosePackages');
        this.packagePickupMode = false;
      }).bind('KeyDown', function(e) {
        if (!this.packagePickupMode) return;

        if (e.key === Crafty.keys['1']) { // 1
          console.log('Picked up package #1');
        }
      });
  }
});

Crafty.c('Hub', {
  init: function() {
    this.requires('2D, DOM, Text')
      .attr({
        h: 200,
        w: 400,
        x: Game.width() - 325,
        y: Game.height() - 50
      });
  },
});

Crafty.c("DiagonalLine", {
    init: function () {
        this.requires("2D, Canvas, Wall");
        this.bind("Draw", this._draw_me);
        this.ready = true;
    },
    _draw_me: function (e) {
        var ctx = e.ctx;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(e.pos._x, e.pos._y);
        ctx.lineTo(e.pos._x + 35, e.pos._y + 37);
        ctx.stroke();
    }
});