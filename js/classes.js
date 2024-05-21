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
    constructor(treeKind, x, y, tileX, tileY) {
        this.treeKind = treeKind;
        this.age = 0;
        this.color = 'green';
        this.x = x;
        this.y = y;
        this.tileX = tileX;
        this.tileY = tileY;
        this.size = 10;
        this.draw();
    }

    draw = function() {
        let color = this.color;
        cntxt.fillStyle = color;
        cntxt.fillRect(this.x * tileX, this.y * tileY, this.size, this.size);
    }
}