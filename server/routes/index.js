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
    domain = "http://192.168.0.104:3333";


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
                    myZanList: '[]',
                    myCommentList: '[]',
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
    users.user.update({userId: data.userId}, {$set: { [data.type]: data.value }}, (err, doc) => {
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
        nickName: req.body.nickName,
        avatar: req.body.avatar,
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
                nickName: catInfo.nickName,
                avatar: catInfo.avatar,
                // 评论列表
                commentList: '[]',
                // 点赞列表
                praiseList: '[]',
                 // 经度
                latitude: '',
                // 纬度
                longitude: '',
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

// 点赞接口
router.post('/addZan', (req, res, next) => {
    let catInfo = {
        userId: req.body.userId,
        catId:  req.body.catId
    };
    // 先拿到当前说说
    cats.cat.findOne({id: catInfo.catId}, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {
        let praiseList = [],
            arr = [],
            isPraise = false,
            praiseCount = 0

        praiseList = JSON.parse(result.praiseList);
        console.log('praiseList.length = ', praiseList.length);
        // 判断有没有人点赞
        if (praiseList.length) {
            praiseList.forEach((item, index) => {
                // 计算有多少人点赞
                if (item.isPraise) {
                    praiseCount++;
                }
                if (item.userId == catInfo.userId) {
                    isPraise = true;
                    if (item.isPraise) {
                        --praiseCount
                    } else {
                        ++praiseCount
                    }
                    item.isPraise = !item.isPraise;
                    item.praiseTime = Date.now();
                }
            });
            if (!isPraise) {
                ++praiseCount
                praiseList.push({
                    userId: catInfo.userId,
                    isPraise: true,
                    praiseTime: Date.now()
                })
            }
            arr = praiseList;

            // 更新我的点赞列表
            util.updateMyZanList(users.user, catInfo, arr);

            // 更新说说
            cats.cat.update({id: catInfo.catId}, {$set: { praiseList: JSON.stringify(arr) }}, (err, doc) => {
                return util.dbPromise(err, doc)
            })
            .then(result2 => {
                res.json({
                    status: 0,
                    msg: '操作成功',
                    result: praiseCount
                })
            })
        } else {
            arr.push({
                userId: catInfo.userId,
                isPraise: true,
                praiseTime: Date.now()
            });

            // 更新我的点赞列表
            util.updateMyZanList(users.user, catInfo, arr);

            // 更新说说
            cats.cat.update({id: catInfo.catId}, {$set: { praiseList: JSON.stringify(arr) }}, (err, doc) => {
                return util.dbPromise(err, doc)
            })
            .then(result2 => {
                res.json({
                    status: 0,
                    msg: '点赞成功',
                    result: 1
                })
            })
        }
    })
    .catch(err => {
        res.json({
            status: 1,
            msg: err.message
        });
    });
})

// 评论接口
router.post('/addComment', (req, res, next) => {
    let catInfo = {
        catId: req.body.catId,
        userId: req.body.userId,
        nickName: req.body.nickName,
        avatar: req.body.avatar,
        content: req.body.content,
    }
    cats.cat.findOne({id: catInfo.catId}, (err, doc) => {
        return util.dbPromise(err, doc)
    })
    .then(result => {
        let commentList = [];

        commentList = JSON.parse(result.commentList);
        if (commentList.length) {
            commentList.push({
                id: commentList.length+1,
                userId: catInfo.userId,
                nickName: catInfo.nickName,
                avatar: catInfo.avatar,
                commentContent: catInfo.content,
                commentTime: Date.now(),
                praiseList: []
            });

            // 更新我的评论列表
            util.updateMyCommentList(users.user, catInfo, commentList);


            cats.cat.update({id: catInfo.catId}, {$set: { commentList: JSON.stringify(commentList) }}, (err, doc) => {
                return util.dbPromise(err, doc)
            })
            .then(result2 => {
                res.json({
                    status: 0,
                    msg: '评论成功',
                    result: {
                        count: commentList.length,
                        list: commentList
                    }
                })
            })
        } else {
            commentList.push({
                id: 1,
                userId: catInfo.userId,
                nickName: catInfo.nickName,
                avatar: catInfo.avatar,
                commentContent: catInfo.content,
                commentTime: Date.now(),
                praiseList: []
            });

            // 更新我的评论列表
            util.updateMyCommentList(users.user, catInfo, commentList);

            cats.cat.update({id: catInfo.catId}, {$set: { commentList: JSON.stringify(commentList) }}, (err, doc) => {
                return util.dbPromise(err, doc)
            })
            .then(result2 => {
                res.json({
                    status: 0,
                    msg: '评论成功',
                    result: {
                        count: 1,
                        list: commentList
                    }
                })
            })
        }
    })
    .catch(err => {
        res.json({
            status: 1,
            msg: err.message
        });
    });
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
//         superagent
//         .get('http://www.yymapp.com/api')
//         .query(`act=getList&page=${count}&sort=def&turnTid=382`)
//         .end((err, result) => {
//             let arr = JSON.parse(result.text);
//             console.log(arr.data.list.length);

//             let k = 0;
//             createCat(k);
//             function createCat(j) {
//                 console.log('j =', j);
//                 let cat = new cats.cat({
//                     // yym id
//                     yymId: arr.data.list[j].id,
//                     // 唯一id
//                     id: i,
//                     // 创建时间
//                     createTime: arr.data.list[j].addtime,
//                     // 用户id
//                     userId: 1,
//                     // 用户昵称
//                     nickName: arr.data.list[j].author,
//                     // 用户头像
//                     avatar: `http://yymapp.com/user/avatar/${util.randomNum(1, 10)}`,
//                     // 评论列表
//                     commentList: '[]',
//                     // 点赞列表
//                     praiseList: '[]',
//                     // 经度
//                     latitude: '',
//                     // 纬度
//                     longitude: '',
//                     // 文本内容
//                     html: arr.data.list[j].summary,
//                     // 图片内容
//                     imgs: arr.data.list[j].picture,
//                     // 视频内容
//                     videos: arr.data.list[j].video
//                 });
//                 cat.save((err, doc) => {
//                     if (k < arr.data.list.length - 1) {
//                         i++;
//                         k++;
//                         createCat(k);
//                     } else {
//                         i++;
//                         k = 0;
//                         count++;
//                         if (count <= 120) {
//                             init();
//                         } else {
//                             // 数据爬完再更新id
//                             cats.ids.update({ name: 'cat_list' }, { $set: {id: i} }, (err2, doc2) => {
//                                 res.json({
//                                     status: 0,
//                                     msg: '数据已爬取完毕',
//                                     result: i
//                                 });
//                             })
//                         }
//                     }
//                 })
//             }
//         })

//     }
// });

module.exports = router;
