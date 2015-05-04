Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  40,
    height: 40,
    tile: {
      width:  16,
      height: 16
    }
  },
 
  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },
 
  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },
 
  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background("url('assets/blueprint.jpg') no-repeat center center");

    // Simply start the "Game" scene to get things going
    Crafty.scene('Game');

    Crafty.e('Hub');

    Game.createMap();

  },

  createMap: function() {
    var xIdx;
    var yIdx;
    _.each(map, function(y, yIndex) {
      yIdx = yIndex;
      _.each(y, function(x, xIndex) {
        xIdx = xIndex;
        if (x === 1) {
          debugger;
          Crafty.e('Wall').at(xIdx, yIdx);
          // self.occupied[xIdx][yIdx] = true;
        }
      });
    });
  }
}