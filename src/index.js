import initMixin from './init'
import { renderMixin } from './render'
import { lifecyleMixin } from './lifecycle'
import { initGlobalAPI } from './global-api/index'
import { stateMixin } from './state'
function Vue(options) {
    /**
     * 进行初始化
     */
    this._init(options)
}

/**
 * 模块化思想
 * 拆分多个流程到不同文件上
 */
initMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)
lifecyleMixin(Vue)
initGlobalAPI(Vue)

/**
 * 执行流程：
 * new Vue ===> init===> $mount(执行挂载函数 内部就继续走下面的 compile ===> render ===> vnode===> patch ===> DOM)
 */
export default Vue


