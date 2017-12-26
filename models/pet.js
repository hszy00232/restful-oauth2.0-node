// 引入mongoose库
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var petSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    userId: { type: String, required: true },
    quantity: Number
});

module.exports = mongoose.model('pet', petSchema);