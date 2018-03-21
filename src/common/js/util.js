// 根据当前表情的 索引值 转换字符
function en_expression(index) {
    // 要显示的input框
    var textObj = this.$refs.chatInput;
    // 字符
    var textFeildValue = `[em_${index}]`;

    if(document.all && textObj.createTextRange && textObj.caretPos){
        var caretPos=textObj.caretPos;
        caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ?
        textFeildValue+'' : textFeildValue;
    } else if(textObj.setSelectionRange){
        var rangeStart=textObj.selectionStart;
        var rangeEnd=textObj.selectionEnd;
        var tempStr1=this.chatInput.substring(0,rangeStart);
        var tempStr2=this.chatInput.substring(rangeEnd);
        this.chatInput=tempStr1+textFeildValue+tempStr2;
        textObj.focus();
        var len=textFeildValue.length;
        textObj.setSelectionRange(rangeStart+len,rangeStart+len);
        textObj.blur();
    }else{
        this.chatInput+=textFeildValue;
    }
}

// 根据当前文本框内容，匹配表情字符，将其转换为图片
function de_expression(text) {
    var patt = /\[em_([0-9]*)\]/g;
    if (patt.test(text)){
        text = replace_em(text);
    }
    return text;
}

// 过滤表情字符转换为图片
function replace_em(str){
  str = str.replace(/\</g,'&lt;');
  str = str.replace(/\>/g,'&gt;');
  str = str.replace(/\n/g,'<br/>');
  str = str.replace(/\[em_([0-9]*)\]/g,'<img src="http://image.kqun.com/resources/vueresources/icon/arclist4/$1.png" class="express-emoji" />');
  return str;
}

// 验证手机号
export function checkMobile(str) {
	var re = /^1\d{10}$/
	if (re.test(str)) {
		return true;
	} else {
		return false;
	}
}

// 获取范围内的随机数
function randomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range);
    return num;
}

// 获取地址栏参数值
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

// 获取数组中最大值
function getArrayMaxVal(arr) {
	var result = arr[0];
    arr.forEach(item => {
        if (result < item) result = item;
    });
    return result;
}

// 获取数组中最小值
function getArrayMinVal(arr) {
	var result = arr[0];
    arr.forEach(item => {
        if (result > item) result = item;
    });
    return result;
}

// 数组去重
function clearRepeatArray(arr) {
	return [...new Set(arr)]
}

// 去除数组中为空的字段
function clearNullArray(arr) {
	for (var i = 0; i < arr.length; i++) {
        if (!arr[i]) {
	        arr.splice(i, 1);//返回指定的元素
	        i--;
        }
    }
    return arr;
}

/**
	倒计时
	ele: 显示的DOM元素
	startTime: 开始时间
	endTime: 结束时间
*/
function countdown(ele, startTime, endTime) {
	var time_now_server,time_now_client,time_end,time_server_client,timerID;

time_end=new Date(endTime);//结束的时间
time_end=time_end.getTime();

time_now_server=new Date(startTime);//开始的时间
time_now_server=time_now_server.getTime();

time_now_client=new Date();
time_now_client=time_now_client.getTime();

time_server_client=time_now_server-time_now_client;

setTimeout("show_time()",1000);

function show_time()
{
 var timer = ele;
 if(!timer){
 return ;
 }
 timer.innerHTML =time_server_client;

 var time_now,time_distance,str_time;
 var int_day,int_hour,int_minute,int_second;
 var time_now=new Date();
 time_now=time_now.getTime()+time_server_client;
 time_distance=time_end-time_now;
 if(time_distance>0)
 {
  int_day=Math.floor(time_distance/86400000)
  time_distance-=int_day*86400000;
  int_hour=Math.floor(time_distance/3600000)
  time_distance-=int_hour*3600000;
  int_minute=Math.floor(time_distance/60000)
  time_distance-=int_minute*60000;
  int_second=Math.floor(time_distance/1000)

  if(int_hour<10)
   int_hour="0"+int_hour;
  if(int_minute<10)
   int_minute="0"+int_minute;
  if(int_second<10)
   int_second="0"+int_second;
  str_time=int_day+"天"+int_hour+"小时"+int_minute+"分钟"+int_second+"秒";
  timer.innerHTML=str_time;
  setTimeout("show_time()",1000);
 }
 else
 {
  timer.innerHTML =timer.innerHTML;
  clearTimeout(timerID)
 }
}
}

// 将时间戳转换成时间
function getDateDiff(value) {
	if (!value) return;
    var timestamp = value / 1000;
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }
    var curTimestamp = parseInt(new Date().getTime() / 1000); // 当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if ( timestampDiff < 60 ) { // 一分钟以内
        return zeroize(H) + ':' + zeroize(i);
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return zeroize(H) + ':' + zeroize(i);
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
            return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}



//----------------------------------------------------------
//    功能：检查身份证号码
//  参数：
//    idcard
//    返回值：
//----------------------------------------------------------
function CheckIdCard(idcard){
    　　var Errors=new Array(
    　　　　1,
    　　　　0,
    　　　　0,
    　　　　0,
    　　　　0
    　　);
    　　var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
    　　　　　　31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
    　　　　　　41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
    　　　　　　61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

    　　var idcard,Y,JYM,ereg;
    　　var S,M;
    　　var idcard_array = new Array();
    　　idcard_array = idcard.split("");
    　　//地区检验
    　　if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
    　　//身份号码位数及格式检验
    　　switch(idcard.length){
    　　　　case 15:
    　　　　　　if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 &&
    　　　　　　　　　　(parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
    　　　　　　　　ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
    　　　　　　} else {
    　　　　　　　　ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
    　　　　　　}
    　　　　　　if(ereg.test(idcard)) return Errors[0];
    　　　　　　else return Errors[2];

    　　　　　　break;
    　　　　case 18:
    　　//18位身份号码检测
    　　//出生日期的合法性检查
    　　//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
    　　//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
    　　　　　　if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 &&
    　　　　　　　　　　parseInt(idcard.substr(6,4))%4 == 0 )){
    　　　　　　　　ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
    　　　　　　} else {
    　　　　　　　　ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
    　　　　　　}
    　　　　　　if(ereg.test(idcard)){//测试出生日期的合法性
    　　　　　　//计算校验位
    　　　　　　S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
    　　　　　　　　+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
    　　　　　　　　+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
    　　　　　　　　+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
    　　　　　　　　+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
    　　　　　　　　+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
    　　　　　　　　+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
    　　　　　　　　+ parseInt(idcard_array[7]) * 1
    　　　　　　　　+ parseInt(idcard_array[8]) * 6
    　　　　　　　　+ parseInt(idcard_array[9]) * 3 ;
    　　　　　　　　Y = S % 11;
    　　　　　　　　M = "F";
    　　　　　　　　JYM = "10X98765432";
    　　　　　　　　M = JYM.substr(Y,1);//判断校验位
    　　　　　　if(M == idcard_array[17]) return Errors[0]; //检测ID的校验位
    　　　　　　else return Errors[3];
    　　　　}
    　　　　else return Errors[2];
    　　　　break;
    　　　　default:
    　　　　return Errors[1];
    　　　　break;
    　　}

    }
