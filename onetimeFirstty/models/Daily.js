/**
 * Created by Trent on 30/09/2015.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var dailySchema = new Schema({
    dailyDeviceName: String,
    totalEnergy: Array,
    dateStart: Number
});

var collectionName = "homeautos";
var Daily = mongoose.model('Daily', dailySchema, "powerDays");