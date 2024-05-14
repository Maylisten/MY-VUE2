let id = 0;
export class Dep {
    constructor() {
        this.id = id++;
        this.subs = []
    }

    depend() {
        // 多对多双向收集
        Dep.target.addDep(this)
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(watcher => {
            watcher.update();
        })
    }
}

Dep.target = null;
let stack = []
Dep.stack = stack;
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
}

export function popTarget() {
    // Dep.target = null;
    stack.pop();
    Dep.target = stack.at(-1);
}