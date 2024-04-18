export function renderMixin(Vue) {
    Vue.prototype._c = function (...args) {
        return createElement(...args)
    }

    Vue.prototype._v = function (text) {
        return createText(text)
    }

    Vue.prototype._s = function (val) {
        return val === null ? "" : (typeof val === 'object') ? JSON.stringify(val) : val;
    }

    Vue.prototype._render = function () {
        let vm = this;
        const render = vm.$options.render;
        const vnode = render.call(this)
        return vnode;
    }
}

// 创建虚拟dom
function createElement(tag, data = {}, ...children) {
    return vnode(tag, data, data.key, children);
}

function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text,
    }
}
