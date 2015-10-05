/**
 * Created by Adam on 22/09/2015.
 */

var energyConsumed;

calcFunctions = {};

calcFunctions.calculation = function(power, time){
    var oneTime = time / 60;
    console.log("time recorded: " + time + " seconds");
    console.log("time recorded: " + oneTime + " minutes");
    console.log("time recorded: " + oneTime / 60 + " hours");
    energyConsumed = power * oneTime / 60 / 1000;
    return energyConsumed;
};

module.exports = calcFunctions;