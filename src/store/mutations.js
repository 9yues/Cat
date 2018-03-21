import * as types from './mutation-types'
const matutaions = {
	// 设置底部导航状态
	[types.SET_TAB_BAR](state, flag) {
    	state.tabBar = flag
    },
    // 设置是否显示底部导航
    [types.SET_IS_TAB](state, flag) {
        state.isTab = flag
    }
}

export default matutaions
