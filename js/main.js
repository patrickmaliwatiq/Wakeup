$(function() {

    var $patrick;
    var $gameboard = $('.x-gameboard');
    var walkIncrement = 5;
    
    function Person(firstName, lastName, gender, color) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.color = color;
        this.fullName = function() {
            return this.firstName + ' ' + this.lastName;
        };

        this.getId  = function() {
            return this.firstName.toLowerCase() + '_' + this.lastName.toLowerCase();
        };

    };

    function getCurrentLeft() {
        return parseInt(($patrick.css('left').split('px'))[0]);
    };

    function getCurrentTop() {
        return parseInt(($patrick.css('top').split('px'))[0]);
    };

    function onKeyLeft () {
        $patrick.css('left', ((getCurrentLeft()-walkIncrement) + 'px'));
    };  

    function onKeyRight () {
        $patrick.css('left', ((getCurrentLeft()+walkIncrement) + 'px'));
    };    

    function onKeyUp () {
        $patrick.css('top', ((getCurrentTop()-walkIncrement) + 'px'));
    };    

    function onKeyDown () {
        $patrick.css('top', ((getCurrentTop()+walkIncrement) + 'px'));
    };


    function onKeyPress(event) {
         if (!event)
              event = window.event;
         var code = event.keyCode;
         if (event.charCode && code == 0)
              code = event.charCode;
         switch(code) {
              case 37:
                  onKeyLeft();
                  break;
              case 38:
                  onKeyUp();
                  break;
              case 39:
                  onKeyRight();
                  break;
              case 40:
                  onKeyDown();
                  break;
         }
         event.preventDefault();
    }

    function initialize() {
        var patrick = new Person('Patrick', 'Maliwat', 'M', '#000');
        console.log(patrick.fullName());

        $patrick = $('<div>')
            .addClass('person')
            .css({
                'background-color': patrick.color,
                'left': 0
            })
            .data('id', patrick.getId());

        $gameboard.append($patrick);
    };

    initialize();


    window.addEventListener("keydown", onKeyPress, false);

});

