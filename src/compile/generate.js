const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.name === "style") {
            let obj = {}
            attr.value.split(";").filter(item => item).forEach(item => {
                let [key, value] = item.split(":");
                obj[key] = value
            });
            attr.value = obj;
        }
        str += `${attr.name}: ${JSON.stringify(attr.value)}${i === attrs.length - 1 ? "" : ","}`
    }
    return str;
}


function genChildren(el) {
    const children = el.children;
    if (children) {
        return children.map(child => gen(child)).join(",")
    }
}

function gen(node) {
    if (node.type === 1) {
        // 元素
        return generate(node)
    } else {
        // 文本
        let text = node.text;
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            let tokens = [];
            // 正则多次使用
            let lastIndex = defaultTagRE.lastIndex = 0;
            let match;
            while (match = defaultTagRE.exec(text)) {
                const index = match.index;
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join("+")})`
        }
    }
}

export function generate(el) {
    const children = genChildren(el)

    //_c(div, { id: "app", style: { "color": " pink", "background-color": " yellow" } }, _c(div, { class: "container" }, _v("helloworld")))
    const code = `_c(${el.tag}, ${el.attrs.length ? `{${genProps(el.attrs)}}` : "null"}, ${children ? children : null})`
    return code;
}