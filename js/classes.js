class Forest {
    constructor() {
        this.trees = [];
    }

    addTree(tree) {
        this.trees.push(tree);
    }

    getTree(id) {
        return this.trees.find(tree => tree.id === id);
    }

    removeTree(id) {
        this.trees = this.trees.filter(tree => tree.id !== id);
    }
}

class Tree {
    constructor(treeKind) {
        this.treeKind = treeKind;
        this.edad = 0;
        this.id = this.generateUniqueId();
    }

    generateUniqueId() {
        let id = Math.floor(Math.random() * 1000000);
        while (this.isIdTaken(id)) {
            id = Math.floor(Math.random() * 1000000);
        }
        return id;
    }

    isIdTaken(id) {
        return Forest.getTree(id) !== undefined;
    }
}