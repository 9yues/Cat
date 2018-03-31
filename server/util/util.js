

module.exports = {
    // 生成一个随机名字
    createRandomName: (id) => {
        let arr = '喵了个咪';
        return arr + id;
    },
    // 获取范围内的随机数
    randomNum: (Min, Max) => {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range);
        return num;
    },
    // promise
    dbPromise: (err, doc) => {
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc)
            }
        });
    },
    // 更新我的点赞列表
    updateMyZanList(user, catInfo, arr) {
        let myZan = [];
        arr.forEach(item => {
            if (item.userId == catInfo.userId) {
                myZan.push(Object.assign({},item, {
                    catId: catInfo.catId
                }));
                user.findOne({userId: catInfo.userId}, (err, doc) => {
                    let myZanList = JSON.parse(doc.myZanList);
                    let flag = false;
                    myZanList.forEach(zanItem => {
                        // 如果是同一条说说那么只修改点赞状态不新增
                        if (zanItem.catId == catInfo.catId) {
                            flag = true;
                            zanItem.isPraise = myZan[0].isPraise;
                        }
                    });
                    if (!flag) {
                        myZanList = myZanList.concat(myZan)
                    }
                    user.update({userId: catInfo.userId}, {$set: { myZanList: JSON.stringify(myZanList) }}, (err, doc) => {})
                });
            }
        });
    },
    // 生成指定位数的随机字符串
    randomString: (len) => {
        len = len || 32;
    　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }
}
