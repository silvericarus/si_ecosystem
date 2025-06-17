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

class LivingBeing {
  constructor(x, y) {
    this.id = "t";
    this.x = x;
    this.y = y;
    this.age = 0;
    this.lifeExpectancy = 100;
  }
  move(x, y) {
    this.x = x;
    this.y = y;
  }
  ageOneYear() {
    this.age += 1;
  }
  isDead() {
    return this.age >= this.lifeExpectancy;
  }
  generateUUID() {
    return crypto.randomUUID ? crypto.randomUUID() : this.fallbackUUID();
  }
}

class Tree extends LivingBeing {
  constructor(treeKind, x, y) {
    super(x, y);
    this.id = this.generateUUID();
    this.treeKind = treeKind;
    this.age = 0;
    this.x = x;
    this.y = y;
    this.lifeExpectancy = 200;
  }
  toString() {
    return `🌳${this.treeKind} with life expentancy ${this.lifeExpectancy}`;
  }
}
