/**
 * 创建虚拟dom的方法
 * createElement创建标签虚拟dom方法
 * createTextNode创建文本虚拟dom方法
 */

import { createComponent } from './create-component'
import vnode from './vnode'


function makeMap(str) {
    const map = {};
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return (key) => map[key];
}

export const isReservedTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
)


/**
 * 不用递归去创建 因为AST转化为JS语法的时候是这样调用的_c(...)
 */
export function createElement(context, tag, data = {}, ...children) {
    let key = data.key;
    if (key) {
        delete data.key;
    }
    if (typeof tag === 'string') {
        if (isReservedTag(tag)) {
            return vnode(tag, data, key, children, undefined);
        } else {
            /**
             * 判断是组件
             * 如果是组件需要拿到组件定义的，通过组件的定义创造虚拟节点
             */
            let Ctor = context.$options.components[tag]
            return createComponent(context, tag, data, key, children, Ctor)
        }
    }
    return vnode(tag, data, key, children, undefined);
}
export function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}


