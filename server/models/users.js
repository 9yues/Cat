let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let usersIdsSchema = new Schema({
    id: Number
});

let userSchema = new Schema({
  // 用户userId
  userId: Number,
  // 用户名就是手机号
  userTel: String,
  // 用户密码
  userPass: String,
  // 个性签名
  sign: String,
  // 昵称
  nickName: String,
  // 性别 0 女  1  男
  sex: Number,
  // 邮箱
  email: String,
  // 微信号
  wx: String,
  // 头像
  avatar: String,
  // 我赞过的说说
  myZanList: String,
  // 我评论过的说说
  myCommentList: String,
  // 注册时间
  createTime: String,
  // 最后一次登录的时间
  lastLoginTime: String
});

// 输出一个用户集合
module.exports = {
    user: mongoose.model('user', userSchema),
    ids: mongoose.model('users_id', usersIdsSchema)
}
