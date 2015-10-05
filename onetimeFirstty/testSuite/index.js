/**
 * Created by Adam and T-Bone on 28/09/2015.
 */

var personSimulator = require('../lightAutomation/personSimulator');
var deviceController = require('../lightAutomation/deviceController');
var motionTracker = require('../lightAutomation/motionTracker');
var garageController = require('../garageController/');
var fillServerModelFromDB = require('../fillServerModelFromDB');
var devices = require('../devices');
var assert = require('assert');
//describe('normalizePoints', function(){
//    it('should return a list of normalized coordinates', function(){
//        assert.equal(normalizePoints(100, 100, [[30,30],[40,40]]), [[.3,.3], [.4,.4]]);
//    })
//});
var coord1;
var coord2;
before(function(){
    var roomsExceptingBed04 = ["garage","living","dining","balcony", "garden", "garden", "bathroom", "bedroom01", "bedroom02", "bedroom03", "bedroom03"];
    roomsExceptingBed04.forEach(function(room){
        deviceController.addToHasBeenInRoom(room);
    });
    coord1 = new garageController.Coordinate(-16.778869,145.684453);
    coord2 = new garageController.Coordinate(-16.778842,145.684537);
});

describe('testAndSetInRoom', function(){
    it('should return a room id based on given ID number', function(){
        assert.equal(personSimulator.testAndSetInRoom(10),"bedroom04");                 //passes
        //assert.equal(personSimulator.testAndSetInRoom(10),"bedroom05");               //fails

    });
});
describe('testRoomIndexAndUpdateDB', function(){
    it('should update devices state in database and return "room Off"',function(){
        assert.equal(deviceController.testRoomIndexAndUpdateDB("bedroom04"), "bedroom04");
    });
});


describe('printLastRooms', function(){
    it('should log that logging logged',function(){
        assert.equal(deviceController.printLastRooms(), "array logging complete");
    });
});

describe('getArraySize', function(){
    it('should return 11 since array has been filled',function(){
        assert.equal(deviceController.getArraySize(), 11);
    });
});

describe('turnOffUnusedRooms', function(){

    it('should return array of updated rooms',function(){
        assert.equal(deviceController.turnOffUnusedRooms(), "bedroom04");
    });
});

describe('testInRoom', function(){

    it('should return true if both rooms are equal',function(){
        assert.equal(motionTracker.testInRoom("bedroom04","bedroom04"), "bedroom04");
    });
});

describe('turnOffRooms', function(){

    it('should return "garage" since it is not in the test array after testInRoom called shift on the hasBeenInRoom array, popping it off the top',function(){
        assert.equal(motionTracker.turnOffRooms(), "bedroom04");
    });
});

describe('testRoomsAndUpdatePreviousLocationList', function(){

    it('should return "garage", as that has been added to hasBeenInRoom array  in the function',function(){
        assert.equal(motionTracker.testRoomsAndUpdatePreviousLocationList("garage"), "garage");
    });
});

describe('testAndSetDoorState', function(){
    it('should return "home" if person is within 10m',function(){
        assert.equal(garageController.testAndSetDoorState(10), "home");
    });
});

describe('getDistanceAndDoorState', function(){
    it('should return 1 if garage door is open',function(){
        assert.equal(garageController.getDistanceAndDoorState().state, 1);
    });
});


describe('coordinateOperation', function(){
    it('should return distance in meters between two coordinates',function(){
        assert.equal(garageController.coordinateOperation(coord1, coord2), 9.443794985229882);
    });
});


describe('fillServerModelFromDB', function(){
    it('should fill server model so that devices.light01.state === ON || OFF', function(){
        fillServerModelFromDB();
        try {
            assert.equal(devices.light01.state, "ON");
        }catch(AssertionError){
            assert.equal(devices.light01.state, "OFF");
        }
    });
});