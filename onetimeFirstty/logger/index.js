var statGenerator = require('../statisticsGenerator');
var DAO = require('../houseDAO');
var device;
var sum;
loggingFunctions = {};

loggingFunctions.updateDeviceLog = function (deviceName, state) {
    DAO.retrieveArrayAndPushTime(deviceName, state, function (timeArray, timeSelector) {
        console.log(timeArray);
        console.log(timeSelector);
        DAO.insertLogArray(timeArray, deviceName, timeSelector);
    });


};

loggingFunctions.logDevices = function (deviceName) {
        DAO.retreiveTimeArrayDifferences(deviceName, function (differenceArray) {
            console.log(differenceArray.toString());
                DAO.retrieveWattage(deviceName, function (power) {
                calculateKWAndPushResults(deviceName ,differenceArray, power);
                });
        });
};




var calculateKWAndPushResults =function(deviceName, differenceArray, power) {
    sum = 0;
    if(differenceArray.length >= 0) {

        for (var i = 0; i < differenceArray.length; i++) {
            var stat = statGenerator.calculation(power, differenceArray[i]);
            sum += stat;
            console.log("total kilowatt hours usage for " + deviceName + ": " + sum);
            var mySum = sum;
            if (i === differenceArray.length - 1) {
                DAO.retrieveTotalEnergyArray(deviceName, function (dailyEnergyArray) {
                    if(dailyEnergyArray.length === 7){                                      //bound length of Daily Energy Array for 1 week
                        dailyEnergyArray.shift();
                    }
                    dailyEnergyArray.push(mySum);
                    console.log("returned values: " + deviceName + " value: " + dailyEnergyArray);
                    DAO.pushDailyEnergyUseArray(deviceName, dailyEnergyArray);
                });
            }
        }
    }else{
        var mySum = 0;
        DAO.retrieveTotalEnergyArray(deviceName, function (dailyEnergyArray) {
            if(dailyEnergyArray.length === 7){                                      //bound length of Daily Energy Array for 1 week
                dailyEnergyArray.shift();
            }
            dailyEnergyArray.push(mySum);
            console.log("returned values: " + deviceName + " value: " + dailyEnergyArray);
            DAO.pushDailyEnergyUseArray(deviceName, dailyEnergyArray);
        });
    }
};



/*
loggingFunctions.logDevices = function () {
    var sum;
        sum = 0;
        DAO.retreiveTimeArrayDiffrences(device, function (differenceArray) {
            console.log(differenceArray.toString());

            DAO.retrieveWattage(device, function (power) {
                for (var i = 0; i < differenceArray.length; i++) {
                    var stat = statGenerator.calculation(power, differenceArray[i]);
                    sum += stat;
                }
                console.log("total kilowatt hours usage for " + device + ": " + sum);
                DAO.retrieveTotalEnergyArray(device, function (dailyEnergyArray) {
                    dailyEnergyArray.push(sum);
                    console.log("returned values: " + dailyEnergyArray);
                    DAO.pushDailyEnergyUseArray(device, dailyEnergyArray);

                });
            });
        });



};
*/


module.exports = loggingFunctions;