let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let catListsSchema = new Schema({
  // 唯一id
  id: Number,
  // 创建时间
  createTime: String,
  // 用户昵称
  nickName: String,
  // 用户id
  userId: Number,
  // 用户头像
  avatar: String,
  // 评论数
  comments: Number,
  // 点赞数
  praises: Number,
  // 文本内容
  html: String,
  // 图片内容
  imgs: String,
  // 视频内容
  videos: String
});

// 输出一个用户集合
module.exports = mongoose.model('cat_list', catListsSchema);
