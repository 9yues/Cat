import axios from 'axios'
import qs from 'qs'

// 添加讲师
export function addLiveTeacher(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/addLiveTeacher`,
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    })
}

// 获取列表数据
export function getCatList(obj) {
    const params = Object.assign({}, {}, obj);
    return axios({
        url: `${url}/getCatList`,
        method: 'GET',
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
