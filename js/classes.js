class Item {
  constructor(name, x, y, board) {
    this.name = name;
    this.id = this.generateUUID();
    this.neighbours = new Map();
    this.x = x;
    this.y = y;
    this.populateNeighbours(board);
  }
  toString() {
    return `${this.name} at (${this.x}, ${this.y})`;
  }
  generateUUID() {
    return crypto.randomUUID ? crypto.randomUUID() : this.fallbackUUID();
  }
  fallbackUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  addNeighbour(coords, item) {
    if (!this.neighbours.has(coords)) {
      this.neighbours.set(coords, item);
    }
  }
  populateNeighbours(board) {
    //populate neighbours based on the x and y values of the item
    const directions = [
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }, // right
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 }, // down
      { x: -1, y: -1 }, // top-left
      { x: 1, y: -1 }, // top-right
      { x: -1, y: 1 }, // bottom-left
      { x: 1, y: 1 }, // bottom-right
    ];
    directions.forEach((direction) => {
      const newX = this.x + direction.x;
      const newY = this.y + direction.y;
      //check if the new coordinates are within the bounds of the board
      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < board.length &&
        newY < board[0].length
      ) {
        this.addNeighbour(`${newX}, ${newY}`, board[newX][newY]);
      }
    });
  }
}
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

class LivingBeing extends Item {
  constructor(x, y, board) {
    super("Living Being", x, y, board);
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
}
class Food extends Item {
  constructor(type, x, y, board) {
    super("Food", x, y, board);
    this.type = type;
    this.id = this.generateUUID();
    this.rotTime = 0;
    this.time = 0;
    this.x = x;
    this.y = y;
  }
  toString() {
    return `🍽️${this.type} at (${this.x}, ${this.y}).`;
  }
}

class Tree extends LivingBeing {
  constructor(treeKind, x, y, board) {
    super(x, y, board);
    this.id = this.generateUUID();
    this.treeKind = treeKind;
    this.foodKind = "Fruit";
    this.foodGenerated = 0;
    this.foodGrowthRate = Math.floor(Math.random() * 5) + 1; // In the future, the climate and the water will also impact the food growth rate
    this.food = [];
    this.x = x;
    this.y = y;
    this.lifeExpectancy = 200;
  }
  calculateFoodGrowth() {
    let baseGrowth = this.foodGrowthRate;

    if (this.age < 50) {
      baseGrowth *= 0.5;
    } else if (this.age > this.lifeExpectancy * 0.8) {
      baseGrowth *= 0.7;
    }

    return Math.max(1, Math.floor(baseGrowth));
  }
  generateFood() {
    const amount = this.calculateFoodGrowth();
    for (let i = 0; i < amount; i++) {
      const neighbours = new Map(
        [...this.neighbours].filter((neighbour) => neighbour.id !== this.id)
      );
      if (neighbours.length < 1) {
        console.warn("No available neighbours to place food.");
        return;
      }
      console.log(neighbours);
      // Randomly select an element from the map
      const randomNeighbour = Array.from(neighbours.keys())[
        Math.floor(Math.random() * neighbours.size)
      ];
      const [x, y] = randomNeighbour.split(", ").map(Number);
      const food = new Food(this.foodKind, x, y, board);
      this.food.push(food);
    }
  }
  decideFood() {
    switch (this.treeKind) {
      case "Oak":
        this.foodKind = "Acorn";
        break;
      case "Apple Tree":
        this.foodKind = "Apple";
        break;
      case "Birch":
        this.foodKind = "Birch Seed";
        break;
      default:
        console.warn(`Unknown tree kind: ${this.treeKind}`);
    }
  }
  toString() {
    return `🌳${this.treeKind} with life expentancy ${this.lifeExpectancy}`;
  }
  foodProofOfWork(year) {
    let entry = year * this.age;
    return entry % 6 === 0;
  }
}
