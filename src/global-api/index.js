import { mergeOptions } from '../util/index'
import initExtend from './extend'
import initAssetRegisters from './assets'
import { initMixin } from './mixin'


export function initGlobalAPI(Vue) {
    Vue.options = {}
    initMixin(Vue)
    /**
     * _base就是Vue的构造函数
     */
    Vue.options._base = Vue;
    Vue.options.components = {}
    /**
     * 注册API方法
     */
    initExtend(Vue)
    initAssetRegisters(Vue)
}

