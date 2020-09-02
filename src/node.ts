
export default class Node<T> {
    children: Array<Node<T>>;

    constructor(readonly property: T, ...children: Array<Node<T>>) {
        this.children = children;
    }

    toString() : string {
        return `${this.property}(${this.children})`
    }
}