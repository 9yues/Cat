require('../util/connect')
var express = require('express');
var router = express.Router();
let util = require('../util/util');
// 发起请求
let superagent = require('superagent');
let users = require('../models/users');
let cats = require('../models/catLists');

// 头像上传
let formidable = require('formidable'),
    fs = require('fs'),
    AVATAR_UPLOAD_FOLDER = '/avatar/',
    domain = "http://192.168.0.123:3333";

console.log(util);

// 添加用户
router.post('/addUser', (req, res, next) => {
    let tel = req.body.tel;
    let pass = req.body.pass;
    let param = {
        userTel: tel,
    }
    // 添加用户之前先判断该用户是否存在
    users.user.findOne(param, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {

        // 手机号存在，直接 catch
        if (result) {
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
                    wx: '',
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

// 登录接口
router.post('/login', (req, res, next) => {
    let param = {
        userTel: req.body.tel,
        userPass: req.body.pass
    }
    users.user.findOne(param, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {

        if (!result) {
            res.json({
                status: 2,
                msg: '账号或者密码错误'
            });
        } else {

            // 写入cookie
            res.cookie('userId', result.userId, {
                path: '/',
                maxAge: 1000 * 60 * 60
            })

            // 写入session
            // req.session.user = result;

            // 修改用户最后一次登录时间
            users.user.update({userId: result.userId}, {$set: { lastLoginTime: new Date()}}, (err, doc) => {
                return util.dbPromise(err, doc)
            })
            .then(result2 => {
                // 登录成功
                res.json({
                    status: 0,
                    msg: '登录成功',
                    result
                });
            })
        }

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
    })
})

// 登出接口
router.post('/logout', (req, res, next) => {
    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    })
    res.json({
        status: 0,
        msg: '退出成功'
    })
})

// 修改用户信息接口
router.post('/updateUserInfo', (req, res, next) => {
    let data = req.body;
    users.user.update({userId: data.userId}, {$set: data}, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {
        res.json({
            status: 0,
            msg: '修改成功',
            result
        })
    })
    .catch(err => {
        res.json({
            status: 1,
            msg: err.message
        });
    });
})

// 图片上传接口
router.post('/imgUpload', (req, res, next) => {

    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, (err, fields, files) => {
        console.log(fields)
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
            return;
        }

        let extName = '';  // 后缀名
        switch (files.avatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/gif':
                extName = 'gif';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.json({
                status: 1,
                msg: '只支持png和gif和jpg格式图片'
            })
            return;
        }

        let avatarName = util.randomString(12) + '.' + extName;
        //图片写入地址；
        let newPath = form.uploadDir + avatarName;
        //显示地址；
        let showUrl = domain + AVATAR_UPLOAD_FOLDER + avatarName;
        //重命名
        fs.renameSync(files.avatar.path, newPath);

        res.json({
            status: 0,
            msg: '头像更新成功',
            result: showUrl
        });

    });
})

// 发布猫猫接口
router.post('/addCat', (req, res, next) => {

    let catInfo = {
        userId: req.body.userId,
        html: req.body.html,
        imgs: req.body.imgs
    }

    // 每次添加发布新猫之前，先拿最后一个id
    cats.ids.findOne({}, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {
        result.id = parseInt(result.id);
        ++result.id
        let update = {
            id: result.id
        };

        cats.ids.update({ name: 'cat_list'}, {$set: update},(err, doc) => {
            return util.dbPromise(err, doc)
        }).then(result2 => {
            let catSchema = new cats.cat({
                // 唯一id
                id: update.id,
                // 创建时间
                createTime: Date.now(),
                // 用户id
                userId: catInfo.userId,
                // 评论数
                comments: 0,
                // 点赞数
                praises: 0,
                // 文本内容
                html: catInfo.html,
                // 图片内容
                imgs: catInfo.imgs,
                // 视频内容
                videos: ''
            });
            catSchema.save((err, doc) => {
                return util.dbPromise(err, doc)
            })
        }).then(result3 => {
            res.json({
                status: 0,
                msg: '添加成功'
            })
        })
    })
    .catch(err => {
        res.json({
            status: 1,
            msg: err.message
        });
    })
})

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
