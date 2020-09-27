/**
 * 什么是state:
 * 就是data+computed+watch等等1
 */

import { observe } from "./observer/index";
import { proxy, isObject, noop } from "./util/index";
import Watcher from "./observer/watcher";
import { defineReactive } from "./observer/index";

export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm, opts.computed);
    }
    if (opts.watch) {
        initWatch(vm, opts.watch);
    }
}

function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data;
    for (let key in data) {
        proxy(vm, "_data", key);
    }
    observe(data);
}

function initProps(vm, propsOptions) {
    const props = (vm._props = {});
    for (const key in propsOptions) {
        defineReactive(props, key, propsOptions[key]);
        if (!(key in vm)) {
            proxy(vm, "_props", propsOptions[key]);
        }
    }
}

/**
 * 不是让你实现
 * 而是看vue如何实现
 */
function initMethods(vm, methods) {
    vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm);
}

function initComputed(vm, computed) {
	/**
	 * 存放计算属性的watcher
	 */
    const watchers = (vm._computedWatchers = {});
    for (const key in computed) {
        const uerDef = computed[key];
		/**
		 * 获取get方法
		 */
        const getter = typeof userDef === "function" ? userDef : userDef.get;
		/**
		 * 创建计算属性watcher
		 */
        watchers[key] = new Watcher(vm, userDef, noop, { lazy: true });
        defineComputed(vm, key, userDef);
    }
}

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
};
function defineComputed(target, key, userDef) {
    if (typeof userDef === "function") {
        sharedPropertyDefinition.get = createComputedGetter(key);
    } else {
        sharedPropertyDefinition.get = createComputedGetter(userDef.get);
        sharedPropertyDefinition.set = userDef.set;
    }
	/**
	 * 使用defineProperty定义
	 * 我们可以通过this.getName这种形式获取得到
	 */
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                // 如果dirty为true
                watcher.evaluate(); // 计算出新值，并将dirty 更新为false
            }
			/**
			 * 在这里相当于触发了getter方法
			 * 但是我们的computed watcher是data属性数据的依赖
			 * computed属性本身依赖data数据 所以computed数据收集依赖实质就是data属性来收集依赖（其实就是收集渲染watcher）
			 * 收集依赖
			 */
            if (Dep.target) {
                // 计算属性在模板中使用 则存在Dep.target
				/**
				 * 通过watcher找到该对应的观察目标 dep
				 * dep把依赖（这时候是渲染watcher）收集起来
				 */
				/**
				 * 我们可以在业务中手动创建观察者 实现数据变化就更新
				 * 但是通常这些场景都有watch代替了 而且对应的操作是cb
				 */
				/**
                 * 为什么watcher要收集dep
                 * 我回答下 这就是为什么别人说观察者模式是耦合的 就是体现在这里
                 * 实例化watcher也有保存对应的dep 因为它要知道是哪些dep收集了他
                 * 第一是为了做watcher去重（watcher里面会保存一个dep Set 这种数据结构）
                 * 第二是针对于计算属性computed 实际上它就是一个计算属性watcher（观察者）
                 * 但它同时也是观察目标(因为template可能使用到它) 那么观察目标也是需要收集对应的依赖（收集watcher，这里是收集渲染watcher），
                 * 但是又回过头来说,computed属性实际是依赖于data属性变化而变化，也就是实际帮计算属性收集依赖也就是帮data属性收集依赖，这时候如何收集呢，
                 * 就是要使这个计算属性watcher保存好之前的观察目标B，这也就是为什么watcher要保存dep 此时这个观察目标B不仅收集了计算属性watcher，
                 * 而且会通过计算属性watcher来收集渲染watcher
                 */
                watcher.depend();
            }
            return watcher.value;
        }
    };
}

function initWatch(vm, watch) {
	/**
	 * watch传入的参数多种多样
	 * 统一都处理成key value形式
	 */
    const keys = Object.keys(watch);
    keys.forEach((key) => {
        const handler = watch[key];
        if (Array.isArray(handler)) {
            for (let i = 0; i > handler.length; i++) {
				/**
				 * 为每个回调都创建一个watcher
				 */
                createWatcher(vm, key, handler[i]);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    });
}

function createWatcher(vm, exprOrFn, handler, options) {
	/**
	 * 如果是对象则提取函数和配置
	 */
    if (isObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === "string") {
        handler = vm[handler];
    }
	/**
	 * watch的实新核心就是创建用户watcher
	 * handler就是callback
	 */
    return vm.$watch(exprOrFn, handler, options);
}

export function stateMixin(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb, options = {}) {
        options.user = true;
		/**
		 * 创建用户watcher
		 */
        const watcher = new Watcher(this, exprOrFn, cb, options);
        if (options.immediate) {
            cb.call(vm, watcher.value);
        }
    };
}
