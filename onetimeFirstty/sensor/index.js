var roomId, sensorValue;

module.exports = function(){
    var Sensor = function(roomId){
        this.roomId = roomId
        this.sensorValue = 0;
    }
};

Sensor.prototype.getSensor = function(){
    return this.sensorValue;

}

Sensor.prototype.setSensor = function(value){
    this.sensorValue = value;

}

