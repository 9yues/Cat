require('../util/connect')
var express = require('express');
var router = express.Router();
let util = require('../util/util');
// 发起请求
let superagent = require('superagent');
let users = require('../models/users');
let cats = require('../models/catLists');

console.log(util);

// 添加用户
router.post('/addUser', (req, res, next) => {
    let tel = req.body.tel;
    let pass = req.body.pass;

    // 添加用户之前先判断该用户是否存在
    users.user.find({}, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {

        let flag = false;
        result.forEach(item => {
            if (item.userTel == tel) {
                flag = true;
            }
        });

        // 手机号存在，直接 catch
        if (flag) {
            return Promise.reject({
                status: 2,
                msg: '手机号已存在'
            })
        }
        return util.dbPromise(false, true)

    })
    .then(() => {
        // 每次添加新用户之前，先拿最后一个id
        users.ids.findOne({}, (err, doc) => {
            return util.dbPromise(err, doc)
        })
        .then(result => {

            result.id = parseInt(result.id);
            ++result.id
            let update = {
                id: result.id
            };

            // 更新id
            users.ids.update({name: 'user'}, { $set: update}, (err, doc) => {
                return util.dbPromise(err, doc)
            }).then(result2 => {
                let u = new users.user({
                    userId: update.id,
                    userTel: tel,
                    userPass: pass,
                    sign: '这只喵很懒，什么都没有留下',
                    nickName: util.createRandomName(update.id),
                    sex: util.randomNum(0, 1),
                    email: '',
                    avatar: `http://yymapp.com/user/avatar/${util.randomNum(1, 10)}`,
                    createTime: Date.now(),
                    lastLoginTime: ''
                });

                return u.save((err, doc) => {
                    return util.dbPromise(err, doc)
                });
            }).then(result3 => {
                res.json({
                    status: 0,
                    msg: '注册成功'
                });
            })

        })
    })
    .catch(err => {
        // 判断是否是手动返回
        if (err.status) {
            res.json({
                status: err.status,
                msg: err.msg
            });
        } else {
            res.json({
                status: 1,
                msg: err.message
            });
        }
    });

});




// 获取猫猫列表
router.get('/getCatList', (req, res, next) => {
    let pageIndex = +req.query.pageIndex;
    let pageSize = +req.query.pageSize;
    console.log('pageIndex = ' + pageIndex)
    console.log('pageSize = ' + pageSize)
    // 按照时间排序
    cats.cat.find({}).sort({'createTime':-1}).skip((pageIndex-1) * pageSize).limit(pageSize).exec((err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            res.json({
                status: 0,
                msg: '',
                result: doc
            })
        }
    })
});


// router.get('/', (req, res, next) => {
//     // 爬取数据
//     let count = 1;
//     let i = 1;
//     init();
//     function init () {
//     superagent
//     .get('http://www.yymapp.com/api')
//     .query(`act=getList&page=${count}&sort=def&turnTid=382`)
//     .end((err, sres) => {
//         // 常规的错误处理
//         if (err) {
//         return next(err);
//         }
//         let arr = JSON.parse(sres.text);
//         let result = [];
//         console.log(arr.data.list.length);
//         // 每次添加新用户之前，先拿最后一个id
//         CatListIds.findOne({}, (err, doc) => {
//         if (err) {
//             res.json({
//             status: 1,
//             msg: err.message
//             });
//         } else {
//             doc.id = parseInt(doc.id);
//             ++doc.id
//             let update = {
//             id: doc.id
//             };
//             CatListIds.update({
//             name: 'cat_list'
//             }, {
//             $set: update
//             },(err2, docc) => {
//             if (err2) {
//                 res.json({
//                 status: 1,
//                 msg: err.message
//                 });
//             } else {
//                 arr.data.list.forEach((item, index) => {
//                 i++;
//                 console.log('index = ' + index);
//                 let cat = new CatList({
//                     // 唯一id
//                     id: i,
//                     // 创建时间
//                     createTime: item.addtime,
//                     // 用户昵称
//                     nickName: item.author,
//                     // 用户id
//                     userId: 1,
//                     // 用户头像
//                     avatar: 'http://yymapp.com/user/avatar/1',
//                     // 评论数
//                     comments: 0,
//                     // 点赞数
//                     praises: 0,
//                     // 文本内容
//                     html: item.summary,
//                     // 图片内容
//                     imgs: item.picture,
//                     // 视频内容
//                     videos: item.video
//                 });
//                 cat.save((err3, doccc) => {
//                     if (err3) {
//                     res.json({
//                         status: 1,
//                         msg: err3.message
//                     })
//                     } else {

//                     }
//                 });
//                 });
//                 count++;
//                 if (count <= 98) {
//                 init();
//                 }
//             }
//             });
//         }
//         });
//     })
//     }
// });

module.exports = router;
