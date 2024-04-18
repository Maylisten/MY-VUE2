export function patch(oldVnode, vnode) {
    const el = createEl(vnode);
    const parentEl = oldVnode.parentNode;
    parentEl.insertBefore(el, oldVnode.nextsibling)
    parentEl.removeChild(oldVnode)
    return el;
}

// vnode => 真实dom
function createEl(vnode) {
    let { tag, children, key, data, text } = vnode;
    // 标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        if (children.length > 0) {
            children.forEach(child => {
                vnode.el.appendChild(createEl(child))
            })
        }
    } else {
        // 文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}