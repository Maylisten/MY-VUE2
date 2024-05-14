import { arrayMethods } from "./arr";
import { Dep } from "./dep";

export function observer(data) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    return new Observer(data);
}

class Observer {
    constructor(value) {
        Object.defineProperty(value, "__ob__", {
            enumerable: false,
            value: this
        })
        this.dep = new Dep();
        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods;
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    walk(data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = data[key];
            defineReactive(data, key, value);
        }
    }

    observeArray(value) {
        for (let i = 0; i < value.length; i++) {
            observer(value[i])
        }
    }
}

// 对对象中的属性进行劫持
function defineReactive(obj, key, value) {
    const childDep = observer(value)
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        get() {
            if (Dep.target) {
                dep.depend()
                if (childDep.dep) {
                    childDep.dep.depend();
                }
            }
            return value;
        },
        set(newValue) {
            if (newValue === value) {
                return;
            }
            value = newValue;
            observer(value);
            dep.notify();
        }
    })
}