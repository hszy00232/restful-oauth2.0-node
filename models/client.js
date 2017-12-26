var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }, // 用于识别这个应用
    id: { type: String, required: true }, // for oauth2.0 flow
    secret: { type: String, required: true }, // for oauth2.0 flow
    userId: { type: String, required: true } // 用于识别哪个应用添加了这个应用
});

module.exports = mongoose.model('client', clientSchema);