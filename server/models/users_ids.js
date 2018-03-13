let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let usersIdsSchema = new Schema({
  id: Number
});

// 输出一个用户集合
module.exports = mongoose.model('users_id', usersIdsSchema);
