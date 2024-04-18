export function mountComponent(vm, el) {
    vm._update(vm._render())
}