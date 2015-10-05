/**
 * Created by Adam on 9/09/2015.
 */
var personSimulator = require('../personSimulator');
var deviceController = require('../deviceController/index');

var fillServerModelFromDB = require('../../fillServerModelFromDB');

var rooms = require("../../roomList");
var inroom = require('../../roomLocation');
var count = 0;

fillServerModelFromDB();
var functions = {};

functions.reups = function () {                             //function to cause a loop and initiate
    setTimeout(function (err) {                     //testing for the rooms
        logErrors(err);
        var location = personSimulator.generateLocation();
        incrementAndLogCount();
        functions.testRoomsAndUpdatePreviousLocationList(location);
        functions.turnOffRooms();
        functions.reups();
    }, 6000);
};


functions.testInRoom = function (aRoom, currentRoom) {                 //test current location against a supplied room
    var daroom;
    if (currentRoom === aRoom) {                               //currentRoom is current room in personSimulator
        inroom[aRoom] = true;                                   //only one room will return as being true
        daroom = currentRoom.toString();                        //so the else will turn all other rooms state
        //deviceController.addToHasBeenInRoom(daroom);            //in the local model to false.
        deviceController.printLastRooms();                      //TODO: Find out if inroom model is redundant

    } else {
        inroom[aRoom] = false;
        daroom = false;
    }
        return daroom;
};

functions.turnOffRooms = function () {                                  //
    if (deviceController.getArraySize() >= 11) {
        var unusedRoom = deviceController.turnOffUnusedRooms();
        return unusedRoom;
    }
};

functions.testRoomsAndUpdatePreviousLocationList = function (location) {
    var myroom;
    rooms.forEach(function (room) {
        var returnedRoom = functions.testInRoom(room, location);
        console.log(returnedRoom);
        if (returnedRoom) {
           myroom = deviceController.addToHasBeenInRoom(returnedRoom);
        }
    });
    return myroom;
};

var incrementAndLogCount = function () {
    count++;
    console.log("COUNTER: " + count);
};


var logErrors = function (err) {
    if (err) {
        console.log(err);
    }
};

module.exports = functions;