import { initState } from "./initState";
import { compileToFunction } from "./compile/index";
import { mountComponent } from "./vnode/index";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this;
        vm.$options = options;

        // 初始化状态，进行数据劫持
        initState(vm);

        // 渲染模版
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    };

    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        const options = vm.$options;
        if (!options.render) {
            const template = options.template;
            if (!template) {
                options.template = el.outerHTML;
            }
            const render = compileToFunction(options.template)
            options.render = render;
        }
        mountComponent(vm, el)
    }
}

