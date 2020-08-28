import vnode from './vnode'
import { isObject } from "../util/index";

/**
 * 创建组件虚拟dom节点createComponent
 */
export function createComponent(vm, tag, data, key, children, Ctor) {
    // 获取父类构造函数
    const baseCtor = vm.$options._base;
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
    }
    data.hook = { // 组件的生命周期钩子
        init(vnode) {
            let child = vnode.componentInstance = new Ctor({});
            /**
             * vnode.componentInstance就是vm实例
             * 执行$mount方法会将真实dom挂载在vm.$el
             * 我们可以通过vnode.componentInstance.$el拿到
             */
            child.$mount(); // 组件的挂载
        }
    }
    return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, { Ctor, children });
}
