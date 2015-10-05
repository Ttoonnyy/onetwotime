
var doorState = '0';
var longitude = '145.684537';
var latitude = '-16.778842';

var functions = {};

functions.getDoorState = function(){
        return doorState;
    };

functions.setDoorState = function(state){
    doorState = state;

};
functions.getLat = function(){
        return latitude;
    };


functions.getLong = function(){
        return longitude;
    };

module.exports = functions;
