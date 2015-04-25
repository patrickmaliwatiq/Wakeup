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
 
// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});
 
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  },
});

Crafty.c('Desk', {
  init: function() {
    this.requires('Actor, Color, Collision')
      .color('#FF0000');
      // .onHit('Amber', this.recievePackage);
  },
  recievePackage: function() {
    console.log('Drop package at:' + this.name)
  },
  setOwner: function(owner) {
    this.owner = owner;
    return this;
  }
})

// This is the player-controlled character
Crafty.c('Amber', {
  init: function() {
    this.requires('Actor, Fourway, Color')
      .fourway(4)
      .color('rgb(20, 75, 40)');
  }
});

// This is the player-controlled character
Crafty.c('Amber', {
  init: function() {
    this.packages = [];
    this.requires('Actor, Fourway, Color, Collision')
      .fourway(4)
      .color('rgb(20, 75, 40)')
      .stopOnSolids()
      .onHit('Desk', this.visitDesk)
      // Whenever the PC touches a package, respond to the event
      .onHit('Package', this.pickupPackage);
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
    package.pickUp();
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
      package.destroy();
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
  },

  setTo: function(to) {
    this.to = to;
    return this;
  },
 
  pickUp: function() {
    this.destroy();
    // Crafty.trigger('PackageDroppedOff', this);
  }
});