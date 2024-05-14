import { initGlobApi } from "./gobal-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index";
import { stateMixin } from "./initState"
import { testPatch } from "./test/index"

function Vue(options) {
    this._init(options);
}

// 挂载data，props，methods等数据
initMixin(Vue);

// 生命周期， _update函数
lifecycleMixin(Vue);

// 挂载_render函数, render=>vnode
renderMixin(Vue)

// 添加 $nextTick、$watch
stateMixin(Vue);

// 全局方法 (mixin, extend)
initGlobApi(Vue);

export default Vue;