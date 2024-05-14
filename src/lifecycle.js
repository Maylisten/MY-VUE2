import Watcher from "./observe/watcher"
import { patch } from "./vnode/patch"
export function mountComponent(vm, el) {
    // 调用所有“beforeMount"生命周期钩子
    callHook(vm, "beforeMount")

    // 更新函数
    const updateComponent = () => {
        vm._update(vm._render())
    }

    // 创建Watcher对象包裹一下
    new Watcher(vm, updateComponent, () => {
        // 更新完成回调
        callHook(vm, "updated")
    }, true)

    // 调用所有“mounted”生命周期钩子
    callHook(vm, "mounted")
}

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        let preVnode = vm._vnode;
        if (!preVnode) {
            // 首次更新
            vm.$el = patch(vm.$el, vnode)
            vm._vnode = vnode;

        } else {
            vm.$el = patch(preVnode, vnode)
        }

    }
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}