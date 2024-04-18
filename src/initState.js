import { observer } from "./observe/index"

export function initState(vm) {
    let opts = vm.$options;

    if (opts.props) {
        initProps()
    }

    if (opts.data) {
        initData(vm)
    }

    if (opts.watch) {
        initWatch()
    }

    if (opts.computed) {
        initComputed()
    }
    if (opts.methods) {
        initMethods()
    }
}

function initProps() { }
function initWatch() { }
function initComputed() { }
function initMethods() { }


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
