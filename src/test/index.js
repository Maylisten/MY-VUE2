import { compileToFunction } from "../compile/index";
import Vue from "../index"
import { createEl, patch } from "../vnode/patch";

export function testPatch() {
    let vm1 = new Vue({ data() { return { name: "张三" } } })
    let render1 = compileToFunction(`<ul>
        <li key="a" style="background: red">a</li>
        <li key="b" style="background: yellow">b</li>
        <li key="c" style="background: green">c</li>
        <li key="d" style="background: blue">d</li>
    </ul>`)
    let vnode1 = render1.call(vm1)
    document.body.appendChild(createEl(vnode1))


    let vm2 = new Vue({ data() { return { name: "李四" } } })
    let render2 = compileToFunction(`<ul>
            <li key="a" style="background: red">a</li>
            <li key="a1" style="background: red">a1</li>
            <li key="b" style="background: yellow">b</li>
            <li key="c1" style="background: green">c1</li>
            <li key="c" style="background: green">c</li>
            <li key="d" style="background: blue">d</li>
        </ul>`)
    let vnode2 = render2.call(vm2)

    setTimeout(() => { patch(vnode1, vnode2) }, 3000)

}