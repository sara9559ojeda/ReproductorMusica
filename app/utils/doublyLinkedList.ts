export class Node<T> {
    value: T;
    next: Node<T> | null;
    prev: Node<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

export class DoublyLinkedList<T> {
    head: Node<T> | null;
    tail: Node<T> | null;
    length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(value: T): void {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            if (this.tail) this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    prepend(value: T): void {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }

    traverseToIndex(index: number): Node<T> | null {
        if (index < 0 || index >= this.length) return null;
        let currentNode: Node<T> | null;
        if (index < this.length / 2) {
            currentNode = this.head;
            for (let i = 0; i < index; i++) {
                currentNode = currentNode!.next;
            }
        } else {
            currentNode = this.tail;
            for (let i = this.length - 1; i > index; i--) {
                currentNode = currentNode!.prev;
            }
        }
        return currentNode;
    }

    insert(value: T, index: number): void {
        if (index <= 0) {
            this.prepend(value);
            return;
        }
        if (index >= this.length) {
            this.append(value);
            return;
        }

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

    remove(index: number): Node<T> | null {
        if (index < 0 || index >= this.length) return null;

        let removedNode: Node<T> | null;
        if (index === 0) {
            removedNode = this.head;
            this.head = this.head?.next || null;
            if (this.head) this.head.prev = null;
            if (this.length === 1) this.tail = null;
        } else {
            const leader = this.traverseToIndex(index - 1);
            removedNode = leader?.next || null;
            if (!removedNode) return null;

            leader!.next = removedNode.next;
            if (removedNode.next) {
                removedNode.next.prev = leader;
            } else {
                this.tail = leader;
            }
        }

        this.length--;
        return removedNode;
    }

    printList(): T[] {
        let currentNode = this.head;
        const result: T[] = [];
        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return result;
    }

    
    clear(): void {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}
