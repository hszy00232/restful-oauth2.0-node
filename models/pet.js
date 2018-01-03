// 引入mongoose库
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 定义pet模式
var petSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    userId: { type: String, required: true },
    quantity: Number
});

// 导出pet模型
module.exports = mongoose.model('pet', petSchema);