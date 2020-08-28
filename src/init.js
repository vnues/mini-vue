import { initState } from './state'
import { mountComponent, callHook } from './lifecycle'
import { compileToFunction } from './compiler/index'
import { mergeOptions } from './util/index'
import { initEvents } from './events'

/**
 * 初始化混入原型上的方法
 */
export default function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        /**
         * 之所以这样写 显示知道this的指向
         */
        const vm = this
        /**
         * 可能通过extend方式 所以使用vm.constructor.options
         * 而不直接Vue.options
         */
        vm.$options = mergeOptions(vm.constructor.options, options);
        /**
         * 初始化状态
         */
        initState(vm)
        initEvents(vm)
        callHook(vm, 'created')
        /***
         * 挂载流程
         */
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        /**
         * 单文件组件利用vue-loader会帮我们解析成render的
         */
        /**
         * vm实例的options配置
         * 一个组件也是一个vm实例
         * 所以组件生成的真实dom拿到template就行
         * <my-component>
         *    <div>
         *    </div>
         * </my-component>
         * 不要想象成上面👆这种结构 直接拿到template解析就行
         * 根本不需要考虑<my-component>
         */
        let template = options.template
        /**
         * 如果没写template属性 去html拿
         */
        if (!template && el) {
            template = el.outerHTML
        }
        /**
         * compileToFunction是将模板编译为JS语法
         * 执行render===>得到vnode
         */
        const render = compileToFunction(template)
        options.render = render
        /**
         * 渲染当前的组件
         */
        mountComponent(vm, el)
    }
}



/**
 * 创建vue实例的时候我们同时是可以拿到真实的dom
 * 这点得知道 可以vm.$el上拿到
 */