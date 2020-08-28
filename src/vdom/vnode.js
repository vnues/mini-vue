export default function vnode(tag, data, key, children, text, componentOptions) {
    return { tag, data, key, children, text, componentOptions }
}
export function isSameVnode(oldVnode, newVnode) {
    // 如果两个人的标签和key 一样我认为是同一个节点 虚拟节点一样我就可以复用真实节点了
    return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}