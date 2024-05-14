export const HOOKS = [
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestroy",
    "destroyed",
]

// 策略模式
let strategies = {}
strategies.data = function (parentVal, childVal) {
    return childVal;
}
strategies.computed = function (parentVal, childVal) {
    return childVal;
}
strategies.watch = function (parentVal, childVal) {
    return childVal;
}
strategies.methods = function (parentVal, childVal) {
    return childVal;
}

HOOKS.forEach(hook => {
    strategies[hook] = mergeHook
});

function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat([childVal]);
        } else {
            return [childVal];
        }
    } else {
        return parentVal;
    }
}

export function mergeOptions(parent, child) {
    const options = {};
    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {
        mergeField(key)
    }

    function mergeField(key) {
        if (strategies[key]) {
            options[key] = strategies[key](parent[key], child[key]);
        } else {
            options[key] = child[key];
        }
    }
    return options;
}