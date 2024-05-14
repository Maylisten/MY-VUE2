export function patch(oldVnode, vnode) {
    if (oldVnode.nodeType === 1) {
        // 第一次渲染
        const el = createEl(vnode);
        const parentEl = oldVnode.parentNode;
        parentEl.insertBefore(el, oldVnode.nextsibling)
        parentEl.removeChild(oldVnode)
        return el;
    } else {
        // 后续更新
        // 标签不一致直接替换
        if (oldVnode.tag !== vnode.tag) {
            return oldVnode.el.parentNode.replaceChild(createEl(vnode), oldVnode.el)
        }

        // 标签一致，都为文本标签
        if (!oldVnode.tag) {
            // 文本不一致直接替换
            if (oldVnode.text !== vnode.text) {
                return oldVnode.el.textContent = vnode.text;
            }
        }

        // 标签一致，都为元素标签
        let el = vnode.el = oldVnode.el;
        updateRpors(vnode, oldVnode.data)

        // diff 子元素
        let oldChildren = oldVnode.children || [];
        let newChildren = vnode.children || [];


        if (oldChildren.length > 0 && newChildren.length === 0) {
            //旧有子，新无子，直接清空   
            el.innerHtml = "";
        } else if (oldChildren.length === 0 && newChildren.length > 0) {
            // 旧无子，新有子, 直接添加
            for (let child of newChildren) {
                el.appendChild(createEl(child));
            }
        } else {
            // 新旧均有子
            updateChildren(oldChildren, newChildren, el);
        }
    }
}

// 双指针diff
function updateChildren(oldChildren, newChildren, parent) {
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[oldStartIndex]
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0;
    let newStartVnode = newChildren[newStartIndex]
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex]


    // 创建旧元素映射表
    function makeIndexByKey(children) {
        let map = {};
        for (let i = 0; i < children.length; i++) {
            let key = children[i].key;
            if (key) {
                map[key] = i;
            }
        }
        return map;
    }

    // 两虚拟dom是否是同一种
    function isSameVnode(oldContent, newContent) {
        return oldContent.tag === newContent.tag && oldContent.key === newContent.key
    }

    const map = makeIndexByKey(oldChildren);

    // 交叉比对
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            oldEndIndex = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else {
            // 暴力比对
            let moveIndex = map[newStartVnode.key]
            if (moveIndex === undefined) {
                parent.insertBefore(createEl(newStartVnode), oldStartVnode.el);
            } else {
                let moveVnode = oldChildren[moveIndex];
                // 防止数组塌陷
                oldChildren[moveIndex] = null;
                parent.insertBefore(moveVnode.el, oldStartVnode.el)
                patch(moveVnode, newStartVnode);
            }
            newStartVnode = newChildren[++newStartIndex];
        }
    }


    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            // parent.appendChild(createEl(newChildren[i]));
            parent.insertBefore(createEl(newChildren[i]), parent.children[i])
        }
    }

    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            const child = oldChildren[i];
            if (child) {
                parent.removeChild(child.el);
            }
        }
    }
}

// 更新真实节点的属性
function updateRpors(vnode, oldProps = {}) {
    let newProps = vnode.data || {};
    let el = vnode.el;

    // 对于属性，旧有，新没有，删除属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }

    // 对于style， 旧有，新没有，删除
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = undefined;
        }
    }

    // 对于属性，新有，添加属性
    for (let key in newProps) {
        if (key === "style") {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            }
        } else if (key === "class") {
            el.className = newProps.class;
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }


}

// vnode => 真实dom
export function createEl(vnode) {
    let { tag, children, key, data, text } = vnode;
    // 标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateRpors(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createEl(child))
        })
    } else {
        // 文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}