class Forest {
    constructor() {
      this.trees = [];
    }
  
    addTree(tree) {
      tree.id = this.trees.length;
      this.trees.push(tree);
    }
  
    getTree(id) {
      return this.trees.find((tree) => tree.id === id);
    }
  
    removeTree(id) {
      this.trees = this.trees.filter((tree) => tree.id !== id);
    }
  }
  
  class Tree {
    constructor(treeKind, x, y) {
      this.treeKind = treeKind;
      this.age = 0;
      this.x = x;
      this.y = y;
    }
  
  }
  