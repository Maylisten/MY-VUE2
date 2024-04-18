const oldArrayProtoMethods = Array.prototype;

export const arrayMethods = Object.create(oldArrayProtoMethods);

const methods = ["push", "pop", "shift", "unshift", "splice"]

methods.forEach(item => {
    arrayMethods[item] = function (...args) {
        const result = oldArrayProtoMethods[item].apply(this, args)

        let inserted;
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.splice(2)
                break;
        }
        let ob = this.__ob__;
        if (inserted) {
            ob.observeArray(inserted)
        }
        return result;
    }
})