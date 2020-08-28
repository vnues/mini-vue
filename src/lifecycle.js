import Watcher from './observer/watcher'
import { patch } from './vdom/patch'
import { noop } from './util/index'


/**
 * 调用生命周期钩子
 */
export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach((handler) => {
            handler.call(vm)
        })
    }
}
export function lifecyleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        const prevVnode = vm._vnode
        vm._vnode = vnode
        if (!prevVnode) {
            /**
             * 第一次进行渲染页面不存在prevVnode
             * 直接创建真实的dom并进行挂载
             * 这个$el是真实的#app dom
             */
            vm.$el = patch(vm.$el, vnode)
        } else {
            /**
             * 更新时做diff操作
             */
            vm.$el = patch(prevVnode, vnode)
        }
    }
}

export function mountComponent(vm, el) {
    const options = vm.$options
    vm.$el = el
    let updateComponent = () => {
        vm._update(vm._render())
    }
    /**
     * 用vue开发应用
     * 这个就是由组件搭建而成的
     * 数据一变化 不是细微到更新某个dom节点
     * 而是组件级别的更新 就如updateComponent命名一样
     */
    new Watcher(vm, updateComponent, noop, true) // true表示他是一个渲染watcher
}