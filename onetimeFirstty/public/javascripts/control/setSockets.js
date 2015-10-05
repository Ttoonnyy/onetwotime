/**
 * Created by Adam on 18/09/2015.
 */
var socket = io.connect("http://localhost:3000");

var setSockets = function (socket) {
    socket.on('nowBuilding', function (builder) {
        //console.log("IN NOW BUILDING");
        Object.keys(builder.myDevices).forEach(function (device) {
            //console.log("In Building Client Model Device: " + device);
            //console.log(" Device State: " + builder.myDevices[device].state);
            allDevices[device] = builder.myDevices[device];

            console.log("asjkdbasudivasdu" + allDevices[device]);

        });
    });
    socket.on('connect', function () {

        console.log("connected to client");
    });
};

