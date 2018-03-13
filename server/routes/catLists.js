require('../util/connect')
let express = require('express');
// 发起请求
let superagent = require('superagent');
let router = express.Router();
let CatList = require('../models/catLists');
let CatListIds = require('../models/cat_lists_ids');




router.get('/', (req, res, next) => {

});



// 爬取数据
// let count = 1;
// let i = 1;
// init();
// function init () {
//   superagent
//   .get('http://www.yymapp.com/api')
//   .query(`act=getList&page=${count}&sort=def&turnTid=382`)
//   .end((err, sres) => {
//     // 常规的错误处理
//     if (err) {
//       return next(err);
//     }
//     let arr = JSON.parse(sres.text);
//     let result = [];
//     console.log(arr.data.list.length);
//     // 每次添加新用户之前，先拿最后一个id
//     CatListIds.findOne({}, (err, doc) => {
//       if (err) {
//         res.json({
//           status: 1,
//           msg: err.message
//         });
//       } else {
//         doc.id = parseInt(doc.id);
//         ++doc.id
//         let update = {
//           id: doc.id
//         };
//         CatListIds.update({
//           name: 'cat_list'
//         }, {
//           $set: update
//         },(err2, docc) => {
//           if (err2) {
//             res.json({
//               status: 1,
//               msg: err.message
//             });
//           } else {
//             arr.data.list.forEach((item, index) => {
//               i++;
//               console.log('index = ' + index);
//               let cat = new CatList({
//                 // 唯一id
//                 id: i,
//                 // 创建时间
//                 createTime: item.addtime,
//                 // 用户昵称
//                 nickName: item.author,
//                 // 用户id
//                 userId: 1,
//                 // 用户头像
//                 avatar: 'http://yymapp.com/user/avatar/1',
//                 // 评论数
//                 comments: 0,
//                 // 点赞数
//                 praises: 0,
//                 // 文本内容
//                 html: item.summary,
//                 // 图片内容
//                 imgs: item.picture,
//                 // 视频内容
//                 videos: item.video
//               });
//               cat.save((err3, doccc) => {
//                 if (err3) {
//                   res.json({
//                     status: 1,
//                     msg: err3.message
//                   })
//                 } else {

//                 }
//               });
//             });
//             count++;
//             if (count <= 95) {
//               init();
//             }
//           }
//         });
//       }
//     });
//   })
// }


module.exports = router;
