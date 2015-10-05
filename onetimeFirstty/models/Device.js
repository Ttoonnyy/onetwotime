var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var deviceSchema = new Schema({
    deviceName: String,
    deviceState: String,
    deviceRoom: String
});
var collectionName = "homeautos";
var Device = mongoose.model('Device', deviceSchema);