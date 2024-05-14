import { popTarget, pushTarget } from "./dep";
import { nextTick } from "../utils/nextTick";

let id = 0;

class Watcher {
    constructor(vm, exprOrfn, cb, options = {}) {
        this.vm = vm;
        // 字符串表达式或者函数
        // 当updateComponent使用watcher时，就是函数
        // 当watch使用时就是监听属性的属性名字符串
        this.exprOrfn = exprOrfn;
        // 数据更新触发的回调
        this.cb = cb;
        this.options = options;
        this.lazy = options.lazy;
        this.dirty = this.lazy;

        // 不同情况下初始化getter函数
        if (typeof exprOrfn === "function") {
            // updateComponent 走这里
            // 当数据变化时，运行updateComponent函数
            this.getter = exprOrfn;
        } else {
            //watch 走这里
            // 当数据变化时，获取数据变化后的新值
            this.getter = function () {
                let path = exprOrfn.split(".")
                let obj = vm;
                // 层层调用，收集依赖
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                    if (obj === undefined || obj === null) {
                        break;
                    }
                }
                return obj;
            }
        }
        this.id = id++;
        this.user = options.user;
        this.deps = [];
        this.depsIds = new Set();

        this.value = this.lazy ? void 0 : this.get();
    }

    // 内部调用更新数据的方法
    run() {
        let value = this.get()
        let oldValue = this.value
        this.value = value;
        // 如果时watch使用的，执行cb回调函数
        if (this.user) {
            this.cb.call(this.vm, value, oldValue)
        } else {
            this.cb.call(this.vm)
        }
    }

    // 获取值的方法
    get() {
        pushTarget(this)
        const value = this.getter.call(this.vm)
        popTarget()
        return value;
    }

    evaluate() {
        this.value = this.get()
        this.dirty = true;
    }

    // 外部调用触发更新的方法
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this)
        }
    }

    // 记录关联的dep对象
    addDep(dep) {
        if (!this.depsIds.has(dep)) {
            this.depsIds.add(dep);
            this.deps.push(dep);
            dep.addSub(this);
        }
    }

    depend() {
        this.deps.forEach(dep => {
            dep.depend();
        })
    }

}


// 防抖去重
let queue = [];
let has = {};
// 标记队列是否以及包装成异步任务了，如果没有包装，就用setTimeout包装一下，如果已经包装了，就推入队列就行
let pending = false;

function flushWatcher() {
    queue.forEach(item => { item.run(); })
    queue = []
    has = {};
    pending = false;
}

function queueWatcher(watcher) {
    let id = watcher.id;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        // nextTick的任务会在同步代码执行完成之后统一执行
        // 代码这么做的目的是，同步代码执行完毕后，watcher会去重加入队列中，而flush多个watcher会被作为一个nexttick任务
        if (!pending) {
            nextTick(flushWatcher);
        }
        pending = true;
    }
}

export default Watcher;

