export function getDateDiff(value) {
    if (!value) return;
    let timestamp = parseInt(value) / 1000;
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }
    let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
    let curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    let tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

    let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    let H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if ( timestampDiff < 60 ) { // 一分钟以内
        return zeroize(H) + ':' + zeroize(i);
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return zeroize(H) + ':' + zeroize(i);
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return zeroize(H) + ':' + zeroize(i);
    } else {
        let newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
            return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}
