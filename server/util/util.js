

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
    }
}
