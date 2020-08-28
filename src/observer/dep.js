
let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }

    /**
     * 观察目标发布
     */
    notify() {
        this.subs.forEach((watcher) => {
            watcher.update()
        })
    }
    /**
     * 提供注册方法一
     */
    addSub(watcher) {
        this.subs.push(watcher)
    }
    /**
     * 提供注册方法二
     */
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this) // 让watcher自己把自己存放到dep上
        }
    }
}

/**
 * 使用数组模拟栈
 * 为什么还多声明了一个栈 为了接下来的计算属性✍️
 */
let stack = []

export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}


export default Dep