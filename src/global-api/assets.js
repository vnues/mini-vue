export default function initAssetRegisters(Vue) {
    Vue.component = function (id, definition) {
        definition.name = definition.name || id
        /**
         * 生成一个新的组件类
         */
        definition = this.options._base.extend(definition)
        this.options['components'][id] = definition
    }
}