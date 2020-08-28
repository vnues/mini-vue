import { mergeOptions } from '../util/index'
export default function initExtend(Vue) {
    let cid = 0;
    Vue.extend = function (extendOptions) {
        const Super = this;
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        Sub.cid = cid++;
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        );
        return Sub
    }
}