require('../util/connect')
let express = require('express');
let router = express.Router();
let Users = require('../models/users');
let Users_ids = require('../models/users_ids');



router.get('/', (req, res, next) => {
  // 每次添加新用户之前，先拿最后一个id
  Users_ids.findOne({}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      doc.id = parseInt(doc.id);
      ++doc.id
      let update = {
        id: doc.id
      };
      Users_ids.update({name: 'user'}, {
        $set: update
      },(err2, docc) => {
        if (err2) {
          res.json({
            status: 1,
            msg: err2.message
          })
        } else {
          let user = new Users({
            userId: update.id,
            userTel: '15521054523',
            userPass: '000000',
            sign: '这个人很懒，什么都没有留下',
            nickName: '远方',
            sex: 1,
            email: '1538795093@qq.com',
            avatar: 'http://yymapp.com/user/avatar/1',
            createTime: Date.now(),
            lastLoginTime: ''
          });
          user.save((err3, doc) => {
            if (err3) {
              res.json({
                status: 1,
                msg: err3.message
              })
            } else {
              res.json({
                status: 0,
                msg: '',
                result: {
                  count: 1
                }
              })
            }
          })
        }
      });


    }
  })
});


module.exports = router;
