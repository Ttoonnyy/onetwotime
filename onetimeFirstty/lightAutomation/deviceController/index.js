var DAO = require('../../houseDAO');
var allDevices = require("../../devices");
var functions = {};
var rooms = require("../../roomList");
var hasBeenInRoom = [];

functions.addToHasBeenInRoom = function(aRoom){         //add a room to 'hasBeenInRoom' Array
        if(hasBeenInRoom.length === 11){                //this function implements a bounded array
            hasBeenInRoom.shift();                      //by conditionally performing a shift before
        }                                               //pushing the next rooms name to array
        hasBeenInRoom.push(aRoom);
        return aRoom;
    };


functions.turnOffUnusedRooms = function(){              //cycles through each room and calls
    var updatedRooms = [];//for testing
    rooms.forEach(function(room){                       //'testRoomIndexAndUpdateDB' to turn the
            console.log("testing : " + room);           //devices db value to off
            console.log("rooms number in array: "
                + hasBeenInRoom.indexOf(room));
            var updatedRoom = functions.testRoomIndexAndUpdateDB(room);
            if(updatedRoom){
                updatedRooms.push(updatedRoom);
            }
        });
    return updatedRooms;
    };


functions.printLastRooms = function(){                  //logs 'hasBeenInRoom' to console
    console.log("Listed Rooms:");
    hasBeenInRoom.forEach(function(thisRoom){
        console.log(thisRoom);
    });
    console.log("__________");
    return "array logging complete";
}

functions.getArraySize = function(){                     //logs and returns 'hasBeenInRoom' arrays
    console.log("array length:" +                        //length
        hasBeenInRoom.length);
    return hasBeenInRoom.length;
};



functions.testRoomIndexAndUpdateDB = function(room) {         //tests the index of the passed in room
    if (hasBeenInRoom.indexOf(room) === -1) {               //in 'hasBeenInRoom' bounded array, if
        DAO.turnDevicesOff(room);                           //conditional statement eveluates to true
        return room;                               //the room does not exist in the list
    }
};                                                      //15 minutes

module.exports = functions;