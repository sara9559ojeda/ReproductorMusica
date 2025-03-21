export class Node {
    value: number;
    next: Node | null;
    prev: Node | null;

    constructor(value: number) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

export class DoublyLinkedList {
    head: Node | null;
    tail: Node | null;
    length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(value: number): void {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            if (this.tail) this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    prepend(value: number): void {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }

    traverseToIndex(index: number): Node | null {
        if (index < 0 || index >= this.length) return null;
        let currentNode = this.head;
        let i = 0;
        while (i !== index && currentNode) {
            currentNode = currentNode.next;
            i++;
        }
        return currentNode;
    }

    insert(value: number, index: number): void {
        if (index === 0) {
            this.prepend(value);
        } else if (index >= this.length) {
            this.append(value);
        } else {
            const newNode = new Node(value);
            const leader = this.traverseToIndex(index - 1);
            if (!leader || !leader.next) return;
            const follower = leader.next;
            leader.next = newNode;
            newNode.prev = leader;
            newNode.next = follower;
            follower.prev = newNode;
            this.length++;
        }
    }

    remove(index: number): void {
        if (index < 0 || index >= this.length) return;
        if (index === 0 && this.head) {
            this.head = this.head.next;
            if (this.head) this.head.prev = null;
        } else if (index === this.length - 1 && this.tail) {
            this.tail = this.tail.prev;
            if (this.tail) this.tail.next = null;
        } else {
            const leader = this.traverseToIndex(index - 1);
            if (!leader || !leader.next) return;
            const nodeToRemove = leader.next;
            const follower = nodeToRemove.next;
            leader.next = follower;
            if (follower) follower.prev = leader;
        }
        this.length--;
    }

    printList(): number[] {
        let currentNode = this.head;
        const result: number[] = [];
        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return result;
    }
}
