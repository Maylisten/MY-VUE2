import { observer } from "./observe/index"
import { nextTick } from "./utils/nextTick";
import Watcher from "./observe/watcher";
import { Dep } from "./observe/dep";

export function initState(vm) {
    let opts = vm.$options;

    if (opts.props) {
        initProps()
    }

    if (opts.data) {
        initData(vm)
    }

    if (opts.watch) {
        initWatch(vm)
    }

    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
}

function initProps() { }



function initComputed(vm) {
    let computed = vm.$options.computed;
    let watcher = vm._computedWatchers = {}
    for (let key in computed) {
        let userDef = computed[key];
        let getter = typeof userDef === 'function' ? userDef : userDef.get;
        watcher[key] = new Watcher(vm, getter, () => { }, { lazy: true })
        defineComputed(vm, key, userDef);
    }
}

let sharedPropDefinition = {
    enumerable: true,
    configurable: true,
    get: () => { },
    set: () => { }
}
function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropDefinition.get = createComputedGetter(key);
    } else {
        sharedPropDefinition.get = createComputedGetter(key);
        sharedPropDefinition.set = userDef.set;
    }

    Object.defineProperty(target, key, sharedPropDefinition)
}

function createComputedGetter(key) {
    return function () {
        let watcher = this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    }
}

function initMethods(vm) {
    let methods = vm._methods = vm.$options.methods;
    for (let key in methods) {
        proxy(vm, "_methods", key)
    }
}


function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data

    for (let key in data) {
        proxy(vm, "_data", key)
    }
    observer(data);
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}


function initWatch(vm) {
    let watch = vm.$options.watch;
    for (let key in watch) {
        let handler = watch[key];
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}


function createWatcher(vm, exprOrFn, handler, options = {}) {
    if (typeof handler === "object") {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === "string") {
        handler = vm[handler];
    }

    return vm.$watch(exprOrFn, handler, options)
}


export function stateMixin(Vue) {
    Vue.prototype.$nextTick = (cb) => {
        nextTick(cb)
    };

    Vue.prototype.$watch = function (exprOrFn, handler, options) {
        let watcher = new Watcher(this, exprOrFn, handler, { ...options, user: true })
        if (options.immediate) {
            handler.call(this)
        }
        return watcher
    }
}