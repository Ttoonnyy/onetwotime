var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var logSchema = new Schema({
    name: String,
    onTime: Array,
    offTime: Array,
    watts: Number
});
//logSchema.set("collection", "logs");
var collectionName = "homeautos";
var Log = mongoose.model('Log', logSchema);