
var mongoose = require('mongoose');

var functions = {};

functions.getDifferences = function(device,callback){
    var shortestArray;
    var longestArray;
    var differenceArray = [];
    var doc = mongoose.model("Log").findOne({name: device}, function(err, doc) {
        if(doc.onTime.length > doc.offTime.length){
            shortestArray = doc.offTime;
            longestArray = doc.onTime;
        }else{
            shortestArray = doc.onTime;
            longestArray = doc.offTime;
        }
        for(var i = 0; i < longestArray.length; i++){
            if(doc.offTime[i] && doc.offTime[i] > doc.onTime[i]) {
                differenceArray.push((doc.offTime[i] - doc.onTime[i]) / 1000);
                //console.log("difference value: " + differenceArray[i]);
            }else if(doc.offTime[i] === null){
                differenceArray.push((new Date().getTime() - doc.onTime[i]) / 1000);
            }
        }
        if(longestArray.length === 0){
            differenceArray.push(0);
        }
        callback (differenceArray);
    });

};

functions.getEnergyArray = function(device,callback){
    var dailyEnergyArray;
    var dailyDateTime;
    console.log(device);
    var doc = mongoose.model('Daily').findOne({dailyDeviceName: device}, function(err, doc){
        if (err) {
            console.log(err);
        }
        if (!doc) {
            console.log("docococo martin");
        }
        dailyDateTime = doc.dateStart;
        dailyEnergyArray = doc.totalEnergy;
        callback (dailyEnergyArray, dailyDateTime);
    });
};

functions.updateEnergyArray = function(device, energyArray){
    var myTime = new Date().getTime();
    mongoose.model("Daily").update({dailyDeviceName: device}, {$set: {totalEnergy: energyArray, dateStart: myTime}}, {multi: false}, function (err, numAffected) {
        console.log("updated totalEnergy: " + numAffected);
    });
};

functions.getArrayAndPushTime = function(device,deviceState,callback){
    var timeSelector;
    var myTime = new Date().getTime();
    var doc = mongoose.model("Log").findOne({name: device}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (!doc) {
            console.log("docless martin");
        }
        if (deviceState === "ON") {
            timeSelector = "onTime";
        } else {
            timeSelector = "offTime";
        }
        var timeArray = doc[timeSelector];
        timeArray.push(myTime);
        callback(timeArray, timeSelector);
    });
};

functions.retrieveDeviceWattage = function(device, callback){
    var doc = mongoose.model("Log").findOne({name: device}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (!doc) {
            console.log("doc martin");
        }
        callback(doc.watts);
    });
};

functions.selectorDependantUpdate =function(arrayLog,device,timeSelector){
    if (timeSelector !== "onTime") {
        mongoose.model("Log").update({name: device}, {$set: {offTime: arrayLog}}, {multi: false}, function (err, numAffected) {
            console.log("updated offTime, number affected ");
        });
    } else {
        mongoose.model("Log").update({name: device}, {$set: {onTime: arrayLog}}, {multi: false}, function (err, numAffected) {
            console.log("updated onTime, number affected ");
        });
    }
};

functions.stateDependantUpdate = function(device, state){
    if(state === "OFF") {
        mongoose.model("Log").update({name: device}, {$set: {onTime: [], offTime: []}},
            {multi: false}, function (err, numAffected) {
                console.log("refreshed onTime and offTime Arrays for " + device);
            });
    }else{
        mongoose.model("Log").update({name: device}, {$set: {onTime: [new Date().getTime()], offTime: []}},
            {multi: false}, function (err, numAffected) {
                console.log("refreshed onTime and offTime Arrays for " + device);
            });
    }
};


module.exports = functions;
