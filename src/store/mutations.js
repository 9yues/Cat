import * as types from './mutation-types'
const matutaions = {
	// 设置底部导航状态
	[types.SET_TAB_BAR](state, flag) {
    	state.tabBar = flag
    },
    // 设置是否显示底部导航
    [types.SET_IS_TAB](state, flag) {
        state.isTab = flag
    },
    // 设置用户信息
    [types.SET_USER_INFO](state, key) {
        if (!key.type) {
            state.userInfo = key
        } else {
            state.userInfo[key.type] = key.value;
        }
    },
    // 设置是否显示发布
    [types.SET_IS_PUBLISH](state, flag) {
        state.isPublish = flag
    }
}

export default matutaions
