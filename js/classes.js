class Forest {
    constructor() {
        this.trees = [];
    }

    addTree(tree) {
        tree.id = this.trees.length;
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
    }
}