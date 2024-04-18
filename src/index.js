import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index";

function Vue(options) {
    this._init(options);
}

// 挂载data，props，methods等数据
initMixin(Vue);

// 挂载_render函数, render=>vnode
renderMixin(Vue)

// 生命周期， _update函数
lifecycleMixin(Vue);

export default Vue;