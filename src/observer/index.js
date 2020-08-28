import { isObject, def } from '../util/index'
import Dep from './dep';
import { arrayMethods } from './array';


/**
 * 侦测策略：
 * 对于数组侦测 侦测其方法 索引不侦测 所以如果是[[[]]] 其索引不在侦测范围内 所以依赖收集得特殊处理
 * 对于对象 会侦测所有的熟悉
 * 如果是属性对象 递归给属性绑定__ob__属性
 */
class Observer {
    constructor(value) {
        /**
         * 数组的依赖收集
         * [[[]],[]]
         */
        this.dep = new Dep()
        /**
         * 只有是引用类型才具有这个属性
         * 所以我们经常会打印看到data的属性对象具有__ob__
         * __ob__ 就是oberver实例
         */
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            /**
             * 进行重写覆盖
             */
            value.__proto__ = arrayMethods
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }
    /**
     * [{}]
     * 将数组元素对象进行侦测
     * 对于数组元素还是为数组我们已经重写过数组方法 侦测数组方法就是
     * 索引不进行侦测
     * 递归给属性绑定__ob__属性
     */
    observerArray(value) {
        value.forEach((obj) => {
            observe(obj)
        })
    }
    walk(data) {
        let keys = Object.keys(data)
        keys.forEach(key => {
            defineReactive(data, key, data[key])
        });
    }
}

/**
 * 
 * @param {*} data 
 * @param {*} key 
 * @param {*} value data属性的值
 */
export function defineReactive(data, key, value) {
    /**
     * 每个属性都绑定一个dep实例
     */
    const dep = new Dep()
    let childOb = observe(value) // 递归实现深度数据侦测
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            /**
             * 利用闭包返回数据
             * 收集依赖 千万别data[key] 无限循环了
             */
            if (Dep.target) {
                /**
                 * 每次访问这个数据都会触发 存在watcher才收集
                 */
                dep.depend()
                /**
                 * 如果访问的属性是对象
                 */
                if (childOb) {
                    /**
                     * 收集数组的依赖
                     */
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            console.log("setter", newValue)
            /**
             * 派发更新
             */
            if (value === newValue) { return }
            /**
             * 修改的数据也要进行侦测
             */
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })
}


/**
 * 为每个数组元素添加依赖
 */
function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i]
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) {
            dependArray(current)
        }
    }
}

export function observe(data) {
    /**
     * 传递的属性不是对象
     * 则不用再继续侦测
     */
    let isObj = isObject(data)
    if (!isObj) {
        return
    }
    return new Observer(data)
}