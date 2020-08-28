import { mergeOptions } from '../util/index'


export function initMixin(Vue) {
    Vue.mixin = function (mixin) {
        /**
         * 这里的this指代Vue
         */
        /**
         * mergeOptions合并策略
         * 生命周期通过数组形式进行concat
         * 如果属性是对象 则合并两个对象
         * 其它则直接替代
         */
        /**
         * 之所以这样处理
         * 考虑多次调用Vue.mixin的情况
         * 然后mergeOptions也会在_init 初始化的时候调用 将Vue构造函数的options是实例化的options进行合并 
         * 合并策略是一致的
         * 这就是mixin的原理
         */
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}
