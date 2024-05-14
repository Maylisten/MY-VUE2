import { initState } from "./initState";
import { compileToFunction } from "./compile/index";
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions } from "./utils/index";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this;

        // 使用策略模式合并Vue.options 和 实例上的属性，包括data、watch、生命周期等等
        vm.$options = mergeOptions(Vue.options, options)

        // 调用所有的“beforeCreate”钩子
        callHook(vm, "beforeCreate")

        // 初始化状态，进行数据劫持
        initState(vm);

        // 调用所有的“created”钩子
        callHook(vm, "created")

        // 渲染挂载，如果有el就自动挂载，没有的话就需要手动调用$mount函数
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    };

    Vue.prototype.$mount = function (el) {
        const vm = this;
        // 决定el到底是什么
        el = typeof el === "string" ? document.querySelector(el) : el;
        vm.$el = el;
        const options = vm.$options;

        // 如果没有render函数则生成render函数
        if (!options.render) {
            const template = options.template;
            if (!template) {
                options.template = el.outerHTML;
            }
            // 生成render函数
            const render = compileToFunction(options.template)
            options.render = render;
        }

        // 挂载
        mountComponent(vm, el)
    }
}

