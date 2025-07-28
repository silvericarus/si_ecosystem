class Item {
  constructor(name, x, y, board) {
    this.name = name;
    this.id = this.generateUUID();
    this.neighbours = new Map();
    this.x = x;
    this.y = y;
    this.symbol = "#";
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
    const directions = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ];
    directions.forEach((direction) => {
      const newX = this.x + direction.x;
      const newY = this.y + direction.y;
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
class Floor extends Item {
  constructor(x, y, board) {
    super("Floor", x, y, board);
    this.id = this.generateUUID();
    this.x = x;
    this.y = y;
    this.symbol = ".";
  }
  toString() {
    return `Floor at (${this.x}, ${this.y})`;
  }
  isEmpty() {
    return this.symbol === ".";
  }
}
class LivingBeing extends Item {
  constructor(x, y, board) {
    super("Living Being", x, y, board);
    this.id = this.generateUUID();
    this.x = x;
    this.y = y;
    this.symbol = "L";
    this.age = 0;
    this.lifeExpectancy = 100;
  }
  move(x, y) {
    this.x = x;
    this.y = y;
  }
  isValidMove(x, y) {
    return (
      board[x] != undefined && board[x][y] instanceof Floor && x >= 0 && y >= 0
    );
  }
  ageOneYear() {
    this.age += 1;
  }
  isDead() {
    return this.age >= this.lifeExpectancy;
  }
}
class Animal extends LivingBeing {
  constructor(name, x, y, board) {
    super(x, y, board);
    this.name = name;
    this.id = this.generateUUID();
    this.symbol = "🐾";
    this.x = x;
    this.y = y;
    this.hunger = 0;
    this.thirst = 0;
    this.hungerThreshold = 10;
    this.thirstThreshold = 10;
    this.hungerRate = 1;
    this.thirstRate = 1;
    this.hp = 100;
    this.speed = 10;
    this.animalKind = "";
  }
  eat(food, board) {
    if (food instanceof Food) {
      this.hunger = Math.max(0, this.hunger - food.rotTime);
      this.hp = Math.min(100, this.hp + food.rotTime);
      board[food.x][food.y] = new Floor(food.x, food.y, board);
      generateLogItem(
        log,
        "eaten",
        food.toString(),
        ` has been eaten by ${this.name}.`
      );
    }
  }
  move(x, y) {
    if (this.isValidMove(x, y)) {
      const oldX = this.x;
      const oldY = this.y;
      board[oldX][oldY] = new Floor(oldX, oldY, board);
      this.x = x;
      this.y = y;
      board[x][y] = this;
      this.populateNeighbours(board);
    } else {
      console.warn(`Invalid move for ${this.name} to (${x}, ${y}).`);
    }
  }
  toString() {
    return `${this.symbol}${this.name} with HP: ${this.hp}`;
  }
}
class Carnivore extends Animal {
  constructor(name, x, y, board) {
    super(name, x, y, board);
    this.animalKind = "Carnivore";
    this.symbol = "🐅";
    this.hungerThreshold = 5;
    this.thirstThreshold = 5;
    this.hungerRate = 2;
    this.thirstRate = 2;
    this.hp = 150;
  }
  hunt(herbivore, board) {
    if (herbivore instanceof Animal && prey.animalKind === "herbivore") {
      this.eat(herbivore, board);
      generateLogItem(log, "hunted", herbivore.toString(), ` by ${this.name}.`);
      board[herbivore.x][herbivore.y] = new Floor(
        herbivore.x,
        herbivore.y,
        board
      );
    } else {
      console.warn(`${this.name} cannot hunt ${herbivore.toString()}.`);
    }
  }
  toString() {
    return `${this.symbol}${this.name} with HP: ${this.hp}`;
  }
}
class Herbivore extends Animal {
  constructor(name, x, y, board) {
    super(name, x, y, board);
    this.animalKind = "herbivore";
    this.symbol = "🐇";
    this.hungerThreshold = 10;
    this.thirstThreshold = 10;
    this.hungerRate = 1;
    this.thirstRate = 1;
    this.hp = 100;
  }
  flee(carnivore) {
    if (carnivore instanceof Carnivore) {
      const fleeX = this.x + (Math.random() < 0.5 ? -1 : 1);
      const fleeY = this.y + (Math.random() < 0.5 ? -1 : 1);
      if (this.isValidMove(fleeX, fleeY)) {
        this.move(fleeX, fleeY);
        generateLogItem(
          log,
          "fled",
          this.toString(),
          ` from ${carnivore.name}.`
        );
      } else {
        console.warn(`${this.name} cannot flee to (${fleeX}, ${fleeY}).`);
      }
    } else {
      console.warn(`${this.name} cannot flee from ${carnivore.toString()}.`);
    }
  }
  findFood() {
    const foodSources = Array.from(this.neighbours.values()).filter(
      (item) => item instanceof Food
    );
    if (foodSources.length > 0) {
      const food = foodSources[Math.floor(Math.random() * foodSources.length)];
      this.eat(food, board);
    } else {
      console.warn(`${this.name} could not find food nearby.`);
      const directions = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 },
      ];
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
      const newX = this.x + randomDirection.x;
      const newY = this.y + randomDirection.y;
      if (this.isValidMove(newX, newY)) {
        this.move(newX, newY);
      }
    }
  }
  toString() {
    return `${this.symbol}${this.name} with HP: ${this.hp}`;
  }
}
class TrophicPyramid {
  constructor() {
    this.pyramid = new Map();
  }
  addLevel(level, animal) {
    if (!this.pyramid.has(level)) {
      this.pyramid.set(level, []);
    }
    this.pyramid.get(level).push(animal);
  }
  getLevel(level) {
    return this.pyramid.get(level) || [];
  }
  removeAnimal(animalId) {
    for (const [level, animals] of this.pyramid.entries()) {
      const index = animals.findIndex((animal) => animal.id === animalId);
      if (index !== -1) {
        animals.splice(index, 1);
        if (animals.length === 0) {
          this.removeLevel(level);
        }
        return;
      }
    }
    console.warn(`Animal with ID ${animalId} not found in any level.`);
  }
  removeLevel(level) {
    if (this.pyramid.has(level)) {
      this.pyramid.delete(level);
    } else {
      console.warn(`Level ${level} does not exist in the trophic pyramid.`);
    }
  }
  toString() {
    let result = "Trophic Pyramid:\n";
    this.pyramid.forEach((animals, level) => {
      result += `Level ${level}: ${animals
        .map((animal) => animal.toString())
        .join(", ")}\n`;
    });
    return result;
  }
}
class Food extends Item {
  constructor(type, x, y, board) {
    super("Food", x, y, board);
    this.type = type;
    this.id = this.generateUUID();
    this.rotTime = 0;
    this.time = 0;
    this.symbol = "🍎";
    this.x = x;
    this.y = y;
  }
  toString() {
    return `🍽️${this.type} at (${this.x}, ${this.y}).`;
  }
}
class DeadTree extends Food {
  constructor(x, y, board) {
    super("Dead Tree", x, y, board);
    this.id = this.generateUUID();
    this.x = x;
    this.y = y;
    this.symbol = "𖣂";
  }

  toString() {
    return `Dead Tree at (${this.x}, ${this.y}).`;
  }
}
class Tree extends LivingBeing {
  constructor(treeKind, x, y, board) {
    super(x, y, board);
    this.id = this.generateUUID();
    this.treeKind = treeKind;
    this.foodKind = "Fruit";
    this.decideFood();
    this.foodGenerated = 0;
    this.foodGrowthRate = Math.floor(Math.random() * 5) + 1;
    this.food = [];
    this.symbol = "🌳";
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
      const validNeighbours = Array.from(neighbours.entries()).filter(
        ([, item]) => item instanceof Floor && item.isEmpty()
      );
      if (validNeighbours.length === 0) {
        console.warn("No valid neighbours to place food.");
        return;
      }
      const randomNeighbour =
        validNeighbours[Math.floor(Math.random() * validNeighbours.length)];
      const x = randomNeighbour[1].x;
      const y = randomNeighbour[1].y;
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
