let callbacks = [];
let pending = false;
let timerFunc;

function flush() {
    callbacks.forEach(cb => cb());
    callbacks = [];
    pending = false;
}

if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flush);
    }
} else if (MutationObserver) {
    let observer = new MutationObserver(flush);
    let textNode = document.createTextNode(1);
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = 2;
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flush);
    }
}

export function nextTick(cb) {
    callbacks.push(cb);
    if (!pending) {
        timerFunc()
    }
}