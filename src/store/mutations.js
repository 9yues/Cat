import * as types from './mutation-types'
const matutaions = {
	// 设置底部导航状态
	[types.SET_TAB_BAR](state, flag) {
    	state.tabBar = flag
	},
}

export default matutaions
