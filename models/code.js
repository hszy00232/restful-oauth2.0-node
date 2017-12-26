var mongoose = require('mongoose');

var codeSchema = new mongoose.Schema({
    value: { type: String, required: true }, // 用于存储授权码,考虑加密
    redirectUri: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true }
});

module.exports = mongoose.model('code', codeSchema);