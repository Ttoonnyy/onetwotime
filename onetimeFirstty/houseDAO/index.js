
var mongoose = require('mongoose');
var fs = require('fs');
var path  = require('path');
mongoose.connect("mongodb://localhost/homeautos");
var logging = require("./logging.js");

fs.readdirSync(__dirname + "/../models").forEach(function(filename){
    if(~filename.indexOf('.js')) require(__dirname + "/../models/" + filename);
});

daoFunctions = {};


daoFunctions.retrieveWattage = logging.retrieveDeviceWattage;
daoFunctions.retreiveTimeArrayDifferences = logging.getDifferences;
daoFunctions.retrieveTotalEnergyArray = logging.getEnergyArray;
daoFunctions.pushDailyEnergyUseArray = logging.updateEnergyArray;
daoFunctions.retrieveArrayAndPushTime = logging.getArrayAndPushTime;

daoFunctions.refreshOnTimeOffTimeArrays = logging.stateDependantUpdate;
daoFunctions.insertLogArray = logging.selectorDependantUpdate;


daoFunctions.asyncToggleState = function(device, callback){
    //do set set state for device in db
    var doc = mongoose.model("Device").findOne({deviceName: device}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if(!doc){
            console.log("doc is null");
        }
        if (doc["deviceState"] === "OFF") {
            doc["deviceState"] = "ON";
        } else {
            doc["deviceState"] = "OFF";
        }
        mongoose.model("Device").update({deviceName: device},{$set:{ deviceState: doc.deviceState}}, {multi:false}, function(err, numAffected){
            console.log("affected: "+ numAffected.toString());
        });
        console.log("state: " + doc.deviceState);
        //pass the parameter to the callback after its new value assigned
        callback(doc.deviceState);
    });
};


daoFunctions.getState = function(device, callback){             //retreive device state from db
    var doc = mongoose.model("Device")
        .findOne({deviceName: device}, function (err, doc) {
        if (!doc) {
            console.log("doc in nulls");
        }
        callback (doc.deviceState);
    });
};


daoFunctions.turnDevicesOff = function (aroom) {
    var doc;
    doc = mongoose.model("Device").find({deviceRoom: aroom}, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (!docs) {console.log("doc is null");
        }
        docs.forEach(function (deviceDoc){
            mongoose.model("Device").update({deviceName: deviceDoc.deviceName},{$set: { deviceState: "OFF"}}, {multi:false}, function(err, numAffected){
                console.log("affected: "+ numAffected);
            });
            daoFunctions.retrieveArrayAndPushTime(deviceDoc.deviceName, "OFF", function(timeArray, state){
                if(deviceDoc.deviceState === "ON") {
                    daoFunctions.insertLogArray(timeArray, deviceDoc.deviceName, "offTime");
                }
           });
        });
    });
};


daoFunctions.asyncGetStates = function(devices) {
   devices.forEach(function (device) {
        var docs = mongoose.model("Device").find({deviceName: {$in: ["light01", "light02", "light03", "light04", "light05", "light06", "light07", "light08", "light09", "light10", "light11"]}}, function (err, doc) {
            if (err) {
                console.log(err);
            }
            if (!doc) {
                console.log("no Doc");
            }
            console.log("in the thing");
        });
 });

};

module.exports = daoFunctions;

