export function isObject(value) {
    return value && typeof value === 'object'
}


export function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

export function noop() { }


export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value
    })
}

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
]
/**
 * 策略模式的应用
 */
const strats = {};


/**
 * 组件属性的合并策略
 */
function mergeAssets(parentVal, childVal) {
    const res = Object.create(parentVal);
    const keys = Object.keys(childVal)
    if (childVal) {
        for (let key in childVal) {
            res[key] = childVal[key];
        }
    }
    return res;
}
strats.components = mergeAssets;

/**
 * 生命周期的合并策略
 */
function mergeHook(parentVal, childValue) {
    if (childValue) {
        if (parentVal) {
            return parentVal.concat(childValue);
        } else {
            return [childValue]
        }
    } else {
        return parentVal;
    }
}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

/**
 * 合并用户自定义传入的options与组件的options
 */
export function mergeOptions(parent, child) {
    const options = {}
    for (let key in parent) {

        mergeField(key)

    }
    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        if (key === '_base') {
            options[key] = parent[key]
            return
        }
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key]);
        } else {
            if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
                options[key] = {
                    ...parent[key],
                    ...child[key]
                }
            } else {
                if (child[key]) {
                    options[key] = child[key];
                    return
                }
                options[key] = parent[key]
            }
        }
    }
    return options
}



export function isDef(v) {
    return v !== undefined && v !== null
}