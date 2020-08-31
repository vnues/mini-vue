import { pushTarget, popTarget } from "./dep"
import { queuWatcher } from "./scheduler"
import { traverse } from "./traverse"


/**
 * 创建watcher的过程中
 * 你想让watcher存入观察目标
 * 就得触发依赖收集的行为
 */
let id = 0
class Watcher {
    /**
     * 
     * @param {*} vm vue实例
     * @param {*} exprOrFn 触发收集依赖的前置操作
     * @param {*} callback 回调函数
     * @param {*} options 配置
     */
    constructor(vm, exprOrFn, callback, options) {
        if (options) {
            this.user = !!options.user
            this.sync = !!options.sync
            this.lazy = !!options.lazy
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }
        this.vm = vm
        this.callback = callback
        this.options = options
        this.deps = []
        this.depsId = new Set()
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else {
            /**
             * 这个时候还没有new完
             * 同时Dep.target也是null
             */
            this.getter = function () {
                let path = exprOrFn.split('.')
                let obj = vm
                for (let i = 0; i > path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }
        this.value = this.get()

        /**
         * this.deep=!!options.deep
         * 针对于用户watcher
         * 因为我们这样处理是一层属性
         * 如果深层的子属性
         * 也要收集watcher
         * 所以在这时候挨个访问这些变量触发依赖收集就行
         */

    }
    get() {
        pushTarget(this)
        const value = this.getter.call(this.vm)
        if (this.deep) {
            traverse(value)
        }
        popTarget()
        return value
    }
    /**
     * 通常默认更新都是异步更新的
     */
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else if (this.sync) {
            this.run
        } else {
            queuWatcher(this)
        }
    }
    addDep(dep) {
        let id = dep.id
        /**
         * watcher去重
         * 一个数据多次取值
         * 所以说观察者和观察目标耦合很大
         */
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(this)
            dep.addSub(this)
        }
    }
    run() {
        console.log("这里")
        let value = this.get()
        let oldValue = this.value
        this.value = value
        if (this.user) {
            this.callback.call(this.vm, value, oldValue)
        }
    }
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}


export default Watcher