/**
 * Created by Adam and T-Bone on 29/09/2015.
 */
var assert = chai.assert;
var testButton;
var testList;
var testItem;
before(function () {
    var states = ["OFF", "OFF", "OFF", "OFF", "OFF", "OFF", "OFF", "OFF", "OFF", "OFF", "OFF"];
    var count = 0;
    Object.keys(allDevices).forEach(function (device) {
        allDevices[device] = {};
        allDevices[device].state = states[count];
        count++;
    });

    testButton = document.createElement('input');
    testList = document.createElement('ul');
    testItem = document.createElement('li');

});


describe('normalizePoints', function () {
    it('should return array of points 1 hundreth their original size', function () {
        assert.deepEqual(normalizePoints(100, 100, [[30, 30], [40, 40]]), [[0.3, 0.3], [0.4, 0.4]]);
    });
});


describe('responsiveRoomDraw', function () {
    it('should return "is Mobile" if screenSize is small or "is Regular" for fullscreen', function () {
        try {
            assert.deepEqual(responsiveRoomDraw(rooms.bedroom04, mqMobilePortrait), "is Regular");
        } catch (AssertionError) {
            assert.equal(responsiveRoomDraw(rooms["bedroom04"], mq), "is Regular");
        }
    });
});

describe('drawRoom', function () {
    it('should return the number of points that have been added to a room', function () {
        assert.equal(drawRoom(rooms.bedroom04, rooms.bedroom04.points, rooms.bedroom04.path), 5);
    });
});

describe('deviceListBuilder', function () {
    it('should return value of button thats added to listitem and to a list ', function () {
        assert.equal(deviceListBuilder(rooms.bedroom04), "light11");
    });
});

describe('setButtonAttributes', function () {
    it('should return class name of passed in "li" ', function () {
        assert.equal(setButtonAttributes(testItem, testButton, "light11"), "myButton");
    });
});

describe('appendElementsToList', function () {
    it('should return "Appended Child" if appended', function () {
        assert.equal(appendElementsToList(testList, testItem, testButton, document.createTextNode('k')), "Appended Child");
    });
});

describe('removeRoom', function () {
    it('should return 1 if the child is removed', function () {
        assert.equal(removeRoom(), 1);
    });
});