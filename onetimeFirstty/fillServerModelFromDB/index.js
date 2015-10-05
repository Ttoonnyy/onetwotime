/**
 * Created by Adam on 18/09/2015.
 */

var DAO = require('../houseDAO');
var allDevices = require('../devices');

var fillServerModelFromDB = function () {
    Object.keys(allDevices).forEach(function (device) {
        DAO.getState(device, function (state) {
            allDevices[device].state = state;
            //console.log("StatesDevice: " + device + " : " + allDevices[device]);
        });
    });
};

module.exports = fillServerModelFromDB;