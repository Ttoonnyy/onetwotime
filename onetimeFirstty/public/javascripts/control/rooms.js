var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var display = document.getElementById('roomView');
var mq = window.matchMedia("(min-width: 481px)");
var mqMobilePortrait = window.matchMedia("(min-width: 480px) and (orientation: portrait)");


$(window).on("resize", function () {
    document.location.reload();
    killPopup();
});

var x;                                                                             //lets just declare these
var y;                                                                             //event positions here for now

//setBoundaryPatterns();                                                              //seting patterns from img tags
setSockets(socket);                                                                //see public/javacripts/control/setSockets

var displayRooms = function () {
    buildRoom(rooms["garage"]);
    buildRoom(rooms["dining"]);
    buildRoom(rooms["bathroom"]);
    buildRoom(rooms["balcony"]);
    buildRoom(rooms["garden"]);
    buildRoom(rooms["bedroom01"]);
    buildRoom(rooms["bedroom02"]);
    buildRoom(rooms["living"]);
    buildRoom(rooms["bedroom03"]);
    buildRoom(rooms["bedroom04"]);
    buildRoom(rooms["boundary"]);
    replaceListeners();
};

//--------------------------------Device Button Functionality----------------------------------------


var deviceListBuilder = function (aroom) {
    var myList = document.createElement('ul');
    aroom["things"].forEach(function (device) {
        var myButton = document.createElement('input');
        var myItem = document.createElement('li');                                  //create elements for this button
        var myStateText = document.createTextNode(allDevices[device].state);
        setButtonAttributes(myItem, myButton, device);
        handleButtonWithClosure(myButton);
        setButtonListener(myButton);
        appendElementsToList(myList, myItem, myButton, myStateText);
        //myItem.setAttribute("class", "displaying");
    });
    appendToDisplay(display, myList);
    if (aroom.name !== "boundary") {
        openPopup();
    }
    return myList.firstChild.firstChild.value;
};

var handleButtonWithClosure = function (myButton) {
    return (function (myButton) {                                                   //handle button press with closure
        socket.on("stateChanged", function (stateChanged) {
            if (myButton.name === stateChanged.nameValue) {
                console.log(stateChanged.nameValue + "State Changed To" + stateChanged.stateValue);
                allDevices[stateChanged.nameValue] = stateChanged.stateValue;
                console.log("Name" + stateChanged.nameValue + "buttons value: " + stateChanged.stateValue);
                myButton.parentNode.lastChild.nodeValue = allDevices[stateChanged.nameValue];
                refreshView();
                roomStatusDisplayController()
            }
        });
    }(myButton));
};


var setButtonAttributes = function (myItem, myButton, device) {
    myItem.setAttribute('class', 'myButton');                               //set attributes for elements
    myButton.setAttribute('type', 'button');
    myButton.setAttribute('class', 'niceButton');
    myButton.setAttribute('name', device);
    myButton.setAttribute('value', device);
    return myItem.className;
};

var appendToDisplay = function (display, myList) {
    display.appendChild(myList);                                                //append list to div
};


var appendElementsToList = function (myList, myItem, myButton, myStateText) {
    myItem.appendChild(myButton);                                           //append elements to list item
    myItem.appendChild(myStateText);
    try {
        myList.appendChild(myItem);
        return "Appended Child";
    } catch(Error) {
        return "Failed to append child";
    };                                             //append list item to list
};


var setButtonListener = function (myButton) {                                   //add event listener to button

    myButton.addEventListener('click', function (event) {
        socket.emit("buttonPressed", {myName: myButton.name});
        console.log("pressed button");
    });
    myButton.addEventListener('touchend', function (event) {
        socket.emit("buttonPressed", {myName: myButton.name});
        console.log("pressed button");
    });

};

//------------------------------Room Button Functionality----------------------------------------


var buildRoom = function (aroom) {
    responsiveRoomDraw(aroom, mqMobilePortrait);
};


var responsiveRoomDraw = function (aroom, mq) {
    if (mq.matches) {
        aroom.mobilePoints = normalizePoints(600, 900, aroom.mobilePoints);
        aroom.mobilePoints = denormalizePoints(400, 600, aroom.mobilePoints);
        drawRoom(aroom, aroom["mobilePoints"], aroom["path"]);
        return "is Mobile";

    } else {
        aroom.points = normalizePoints(900, 600, aroom.points);
        aroom.points = denormalizePoints(900, 600, aroom.points);
        drawRoom(aroom, aroom["points"], aroom["path"]);
        return "is Regular";
    }
};


var drawRoom = function (aroom, points, path) {
    var count = 0;
    path.moveTo(points[0][0], points[0][1]);
    for (var i = 0; i < points.length; i++) {
        path.lineTo(points[i][0], points[i][1]);
        count++;
    }
    return count;
};


var replaceListeners = function () {
    canvas.addEventListener('click', listener);
    canvas.addEventListener('touchend', listener);
};


var removeRoom = function () {
    var nextChild;
    var display = document.getElementById('roomView');
    var count = 0;
    while (nextChild = display.firstChild) {
        display.removeChild(nextChild);
        count++;
    }
    return count;
};

var listener = function (event) {

    console.log("in listener");
    if (!buttonState === false) {
        getEventCoords(event);
        refreshView();
        roomStatusDisplayController();
        Object.keys(rooms).forEach(function (room) {
            filterRoomButtonClick(rooms[room], x, y);
            if (rooms[room].name !== "boundary") {
                openPopup();
                buttonState = false;
            }
        });

    } else {
        removeRoom();
        refreshView();
        roomStatusDisplayController();
        buttonState = true;
        closePopup();
    }


};


var filterRoomButtonClick = function (aroom, x, y) {
    if (context.isPointInPath(aroom.path, x, y)) {
        highlightRoom(aroom, "blue");
        //freezeOtherRooms(aroom);
        if (aroom.name !== "boundary") {
            deviceListBuilder(aroom);
        }
        buttonState = false;
    }
};


var getEventCoords = function (event) {
    x = event.x;
    y = event.y;
};

var refreshView = function () {
    context.clearRect(0, 0, 900, 600);
};

var highlightRoom = function(aroom, acolor){
    context.fillStyle = acolor;
    context.globalAlpha = 0.3;
    context.fill(aroom.path);
}

var roomStatusDisplayController = function () {
    Object.keys(allDevices).forEach(function (device) {
        console.log("this room is :" + allDevices[device].room)
        if (allDevices[device].state === "ON") {
            highlightRoom(rooms[allDevices[device].room], "yellow");

        } else if (allDevices[device].state === "OFF") {
            //duck type
            highlightRoom(rooms[allDevices[device].room], "black");
        }
    });
};

var testUpdatedRooms = function () {
    setInterval(function () {
        socket.emit("doBuilding");
        refreshView();
        roomStatusDisplayController();
        console.log('testUpdatedRooms is here');
        //testUpdatedRooms();
    }, 6000);
};


var normalizePoints = function (width, height, myPoints) {
    var pointX;
    var pointY;
    var normalizedPoints = [];
    for (var i = 0; i < myPoints.length; i++) {
        pointX = myPoints[i][0] / width;
        pointY = myPoints[i][1] / height;
        normalizedPoints[i] = [pointX, pointY];
        console.log("My normalised point " + i + "-> x:" + pointX + "-> y: " + pointY);
    }
    return normalizedPoints;
};

var denormalizePoints = function (width, height, myPoints) {
    var pointX;
    var pointY;
    var denormalizedPoints = [];
    for (var i = 0; i < myPoints.length; i++) {
        pointX = myPoints[i][0] * width;
        pointY = myPoints[i][1] * height;
        denormalizedPoints[i] = [pointX, pointY];
        console.log("My denormalised point " + i + "-> x:" + pointX + "-> y: " + pointY);
    }
    return denormalizedPoints;
};