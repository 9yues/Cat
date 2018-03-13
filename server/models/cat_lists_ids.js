let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let catListsIdsSchema = new Schema({
  id: Number
});

// 输出一个用户集合
module.exports = mongoose.model('cat_lists_id', catListsIdsSchema);
