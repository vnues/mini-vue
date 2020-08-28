
/**
 * dom的更新是同步在vuejs1.0的时候
 * 我们执行dom更新又不是解析HTML 不要弄混淆了
 * 事实上dom更新是也是使用nextTick
 * Vue.js2.0使用异步更新队列 
 * 变化的侦测通知只发送到组件
 * 组件内所有状态的变化都会通知到同一个watcher
 * 然后会对整个组件进行更新
 * 事实上这是没有必要的 我们可以使用异步更新 做到批量更新 反正数据都是改变好了 watcher只是通知依赖进行更新 仅此而已
 */

let callbacks = [];
function flushCallbacks() {
    callbacks.forEach(cb => cb());
}
let timerFunc;
if (Promise) { // then方法是异步的
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) { // MutationObserver 也是一个异步方法
    let observe = new MutationObserver(flushCallbacks); // H5的api
    let textNode = document.createTextNode(1);
    /**
     * 监听dom变化
     * 注册事件
     */
    (textNode, {
        /**
         * 设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据的变化。无默认值。
         */
        characterData: true
    });
    timerFunc = () => {
        /**
         * 发布dom改变了
         */
        textNode.textContent = 2;
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}
export function nextTick(cb) {
    callbacks.push(cb);
    timerFunc();
}