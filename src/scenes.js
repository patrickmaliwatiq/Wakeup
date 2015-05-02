Crafty.scene('Game', function() {
  var self = this;
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('Amber').attr({h:10, w:10}).at(5, 5);
  this.occupied[this.player.at().x][this.player.at().y] = true;
 
  // // Place a border at every edge square on our grid of 16x16 tiles
  // for (var x = 0; x < Game.map_grid.width; x++) {
  //   for (var y = 0; y < Game.map_grid.height; y++) {
  //     var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
 
  //     if (at_edge) {
  //       // Place a border entity at the current tile
  //       Crafty.e('Border').at(x, y);
  //       this.occupied[x][y] = true;
  //     } 
  //     // else if (Math.random() < 0.02 && !this.occupied[x][y]) {
  //     //   // Place a wall entity at the current tile
  //     //   Crafty.e('Wall').at(x, y);
  //     //   this.occupied[x][y] = true;
  //     // }
  //   }
  // }

 
  // Generate up to five packages on the map in random locations
  var max_packages = employees.length;
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      if (Math.random() < 0.02) {
        if (Crafty('Package').length < max_packages && !this.occupied[x][y]) {
          var count = Crafty('Package').length;
          Crafty.e('Package').attr({to: employees[count].Name}).at(x, y);
        }
      }
    }
  }

  Crafty.e('Packages').at(8, 8)
  
  _(employees).each(function(employee) {
    Crafty.e('Desk').attr({owner: employee.Name}).at(employee.DeskCoordinates[0], employee.DeskCoordinates[1]);
  });

  var hub = Crafty.e('Hub');
  this.bind('ChoosePackages', function() {
        hub.text(
          'There are 6 packages but Amber has noodle arms.' +   
          'She can only carry up to 10 pounds of packages');
  });

  this.bind('UnchoosePackages', function() {
      hub.text('Nothing');
  });
 
  // this.show_victory = this.bind('PackageDroppedOff', function() {
  //   if (!Crafty('Package').length) {
  //     Crafty.scene('Victory');
  //   }
  // });
}, function() {
  this.unbind('PackageDroppedOff', this.show_victory);
});
 
Crafty.scene('Victory', function() {
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Victory!');
 
  this.restart_game = this.bind('KeyDown', function() {
    Crafty.scene('Game');
  });
}, function() {
  this.unbind('KeyDown', this.restart_game);
});