import axios from 'axios'
import qs from 'qs'

// 添加用户
export function addUser(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/addUser`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 用户登录
export function login(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/login`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 登出
export function logout() {
    return axios({
        url: `${url}/logout`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 修改用户信息
export function updateUserInfo(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/updateUserInfo`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 发布猫猫接口
export function addCat(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/addCat`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 点赞接口
export function addZan(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/addZan`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 评论接口
export function addComment(obj) {
    const params = Object.assign({}, {}, obj);
    const data = qs.stringify(params);
    return axios({
        url: `${url}/addComment`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 单图片上传
export function imgUpload(obj) {
    const data = obj;
    return axios({
        url: `${url}/imgUpload`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data
    }).then(res => {
        return Promise.resolve(res.data)
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
