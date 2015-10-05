var current;
var room;
var functions = {};
var getRandomNumber = function() {
   current = Math.floor((Math.random() * 11 ) +  1);
    console.log("State machine produced: "+ current);
    return current;
};

functions.testAndSetInRoom = function(number) {
    switch (number) {
        case 1:
            room = "garage";
            break;
        case 2:
            room = "dining";
            break;
        case 3:
            room = "bathroom";
            break;
        case 4:
            room = "balcony";
            break;
        case 5:
            room = "garden";
            break;
        case 6:
            room = "bedroom01";
            break;
        case 7:
            room = "bedroom02";
            break;
        case 8:
            room = "living";
            break;
        case 9:
            room = "bedroom03";
            break;
        case 10:
            room = "bedroom04";
            break;
    }
    console.log("In room: " + room);
    return room;
};

functions.generateLocation = function(){
    return functions.testAndSetInRoom(getRandomNumber());
};

module.exports = functions;