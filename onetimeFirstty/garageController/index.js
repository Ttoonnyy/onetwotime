//require model
var garage = require("./garage");

var things;

var functions = {};


functions.getDistanceAndDoorState = function() {
    var houseCoord = new functions.Coordinate(garage.getLat(), garage.getLong());
    console.log(houseCoord.toString());
    var myCoord = new functions.Coordinate(-16.778869, 145.684453);
    mydist = functions.coordinateOperation(myCoord, houseCoord);
    console.log("Distance: " + mydist);
    console.log("State: " + garage.getDoorState());
    functions.testAndSetDoorState(mydist);
    currentDoorState = garage.getDoorState();
    things = {
        dist: mydist,
        state: currentDoorState
    };
    return things;
};



functions.Coordinate = function(lat, long){
    this.latitude = lat;
    this.longitude = long;
};

functions.Coordinate.prototype.toString = function(){
    return "house latitude: " + this.latitude + "\nhouse longitude: "+ this.longitude;
};


functions.coordinateOperation = function (coord0, coord1) {
//uses Haversine formula to produce the distance
    var distanceLatitude = (coord0.latitude - coord1.latitude) * Math.PI / 180;
    var distanceLongitude = (coord0.longitude - coord1.longitude) * Math.PI / 180;
    var radius = 6378.137;
    var average = Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
        Math.cos(coord0.latitude * Math.PI / 180) * Math.cos(coord1.latitude * Math.PI / 180) *
        Math.sin(distanceLongitude / 2) * Math.sin(distanceLongitude / 2);
    var cartesian = 2 * Math.atan2(Math.sqrt(average), Math.sqrt((1 - average)));
    var distance = radius * cartesian;
    return distance * 1000;
//meters
};

functions.testAndSetDoorState = function (dist){
    var inRange = 10;
    if (dist <= inRange){
        console.log("Welcome home jason");
        openDoor();
        return "home";
    }else{
        console.log("user not in distance");
        closeDoor();
        return "away";
    }
};

var openDoor = function(){
    garage.setDoorState(1);

};

var closeDoor = function(){
    garage.setDoorState(0);
};


module.exports = functions;

