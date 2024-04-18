import { generate } from "./generate"

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

let root;
let currentElement;
let stack = [];

function start(tag, attrs) {
    let element = createASTElement(tag, attrs)
    if (!root) {
        root = element;
    }
    currentElement = element;
    stack.push(element)
}

function charts(text) {
    text = text.replace(/\s+/g, " ")
    if (text && text !== " ") {
        currentElement.children.push({
            type: 3,
            text
        })
    }
}

function end() {
    const element = stack.pop();
    currentElement = stack.at(-1);
    if (currentElement) {
        element.parent = currentElement.tag;
        currentElement.children.push(element);
    }
}


function createASTElement(tag, attrs) {
    return {
        tag,
        attrs,
        children: [],
        type: 1,
        parent: null
    }
}

function parseHTML(html) {
    while (html) {
        const textEnd = html.indexOf("<")
        // 标签
        if (textEnd === 0) {
            // 开始标签的内容
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue;
            }
        }

        // 文本
        if (textEnd > 0) {
            const text = html.substring(0, textEnd)
            charts(text);
            advance(text.length);
        }
    }


    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (!start) {
            return;
        }
        let match = {
            tagName: start[1],
            attrs: []
        }
        advance(start[0].length);
        let attr;
        let end;
        // 获取所有属性
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
                name: attr[1],
                value: attr[3] || attr[4] || attr[5]
            })
            advance(attr[0].length)
        }

        if (end) {
            advance(end[0].length)
        }
        return match;
    }

    function advance(n) {
        html = html.substring(n)
    }

    return root;
}

export function compileToFunction(template) {
    // 获取语法树
    const ast = parseHTML(template)

    // 语法树转字符串
    const code = generate(ast)

    // 字符串转函数
    const render = new Function(`with(this){return ${code}}`)

    return render;
}