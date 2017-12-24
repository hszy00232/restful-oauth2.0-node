var mongoose = require('mongoose');

var codeSchema = new mongoose.Schema({
    value: { type: String, required: true },
    redirectUri: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true }
});

module.exports = mongoose.model('code', codeSchema);