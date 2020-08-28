/**
 * Object.defineProperty 是新增和修改对象属性 ✅注意是属性
 * data对象的属性有基本类型、对象、数组
 * 属性的变化也是需要被监控到
 * 改变数组的方式 api 以及索引
 * 重写数组的那些方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
 */



let oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)


const methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice']


methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        let arrInstance = this
        const result = oldArrayMethods[method].apply(this, args)
        let inserted
        let ob = arrInstance.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                insert = args.slice(2)
        }
        if (inserted) {
            ob.observerArray(inserted)
        }
        ob.dep.notify()
        return result
    }
})