export function eventsMixin(Vue) {
	/**
	 * 遍历实例的所有事件
	 * @param vm {Bue} bue实例
	 * @param action {String} 动作类型,此处为'$on',代表绑定事件
	 * @param events {Object} 事件对象,可能包含多个事件, 所以需要遍历
	 */
    function registerCallbacks(vm, action, events) {
        if (!events) return;
        for (let key in events) {
            let event = events[key];
            register(vm, action, key, event);
        }
    }

	/**
	 * 注册单个事件
	 * @param vm {Bue} bue实例
	 * @param action {String} 动作类型,此处为'$on',代表绑定事件
	 * @param key {String} 事件名称, 比如: 'parent-name',代表从父组件那里传递了名称过来
	 * @param event {Function} 触发key事件的时候, 对应的回调函数
	 */
    function register(vm, action, key, event) {
        if (typeof event !== "function") return;
        vm[action](key, event);
    }
	/**
     * Vue注册自定义事件通过$on进行注册
	 * 注册事件及其回调函数到实例上
	 * @param event {String} 事件名称
	 * @param fn {Function} 事件对应的回调函数
	 * @returns {Bue} 实例本身
	 */
    Vue.proptotype.$on = function (event, fn) {
        (this._events[event] || (this._events[event] = [])).push(fn);
        return this;
    };
    Vue.proptotype.$emit = function (event, val) {
        let cbs = this._events[event];
        let shouldPropagate = true;
        if (cbs) {
            shouldPropagate = false;
            // 遍历执行事件
            let args = new Array(Array.from(arguments)[1]);
            cbs.forEach((cb) => {
                let res = cb.apply(this, args);
                // 就是这里, 决定了"只有当events事件返回true的时候, 事件才能在触发之后依然继续传播"
                if (res === true) {
                    shouldPropagate = true;
                }
            });
        }
        return shouldPropagate;
    };
}

export function initEvents(vm) {
    vm._events = Object.create(null)
    registerCallbacks(this, "$on", vm._events);
};