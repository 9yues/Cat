

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
