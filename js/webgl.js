let log;
let map;
let board;
let dayCycleHaltButton;
let dayCycleHalt;
let liveTime;
let secondsFromStart;
let rows = 20;
let cols = 20;
let randomSizeOfForest = Math.floor(Math.random() * 50);
const forest = new Forest();

document.addEventListener("DOMContentLoaded", function () {
  start();
});

function treeGeneration() {
  let treesGenerated = 0;
  generateLogItem(
    log,
    "spawned",
    "Forest",
    ` with ${randomSizeOfForest} trees.`
  );
  for (let i = 0; i < randomSizeOfForest; i++) {
    const x = Math.trunc(Math.floor(Math.random() * cols));
    const y = Math.trunc(Math.floor(Math.random() * rows));
    if (treesGenerated >= randomSizeOfForest) {
      break;
    }
    let tree = new Tree("Oak", x, y, board);
    forest.addTree(tree);
    board[x][y] = tree;
    treesGenerated++;
    tree.id = tree.generateUUID();
    generateLogItem(log, "spawned", tree.toString(), ` at (${x}, ${y}).`);
  }
}

function start() {
  secondsFromStart = 0;
  let foodPOW = false;
  startGL();
  setInterval(() => {
    if (!dayCycleHalt) {
      const horas = Math.floor(secondsFromStart / 3600);
      const minutos = Math.floor((secondsFromStart % 3600) / 60);
      const segundosRestantes = secondsFromStart % 60;
      liveTime.innerHTML = `${horas.toString().padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}:${segundosRestantes.toString().padStart(2, "0")}`;
      secondsFromStart++;
      populateMap();
      forest.trees.forEach(async (tree) => {
        tree.ageOneYear();
        if (tree.isDead()) {
          generateLogItem(log, "death", tree.toString(), " has died.");
          forest.removeTree(tree.id);
          board[tree.x][tree.y] = new DeadTree(tree.x, tree.y, board);
        }
        if (tree.age >= 20) {
          foodPOW = tree.foodProofOfWork(secondsFromStart);
        }
        if (tree.age >= 20 && tree.age % 5 === 0 && foodPOW) {
          tree.calculateFoodGrowth();
          tree.generateFood();
          if (tree.food.length > 0) {
            tree.food.forEach((food) => {
              generateLogItem(log, "spawned", food.toString(), "");
              board[food.x][food.y] = food;
            });
          }
        }
      });
    }
  }, 1000);
  treeGeneration();
}

function smoothScrollToBottom(containerId, duration) {
  const container = document.getElementById(containerId);
  const start = container.scrollTop;
  const end = container.scrollHeight;
  const distance = end - start;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = start + distance * progress;

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

function generateLogItem(log, category, type, details) {
  let card = document.createElement("div");
  card.classList.add("card");

  let cardContent = document.createElement("div");
  cardContent.classList.add("card-content");

  let content = document.createElement("div");
  content.classList.add("content");

  switch (category) {
    case "spawned":
      content.innerHTML = "✨Spawned.<br/>" + type + details;
      break;
    case "death":
      content.innerHTML = "💀Died.<br/>" + type + details;
      break;
    case "success":
      content.classList.add("has-text-success");
      break;
  }

  let time = document.createElement("time");

  let date = new Date();

  time.dateTime =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  const hours = Math.floor(secondsFromStart / 3600);
  const minutes = Math.floor((secondsFromStart % 3600) / 60);
  time.innerText = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${(secondsFromStart % 60).toString().padStart(2, "0")}`;

  cardContent.appendChild(content);
  cardContent.appendChild(time);

  card.appendChild(cardContent);

  log.appendChild(card);

  smoothScrollToBottom("earth", 4000);
}

function createBoard(row, col) {
  let obj = new Array(row);
  for (let y = 0; y < col; y++) {
    obj[y] = new Array(col);
  }

  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      let floor = new Floor(x, y, obj);
      obj[y][x] = floor;
    }
  }
  return obj;
}

function populateLiveData() {
  liveTime = document.getElementById("time");
}

function populateMap() {
  map = document.getElementById("map");
  map.innerHTML = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.setAttribute("id", `cell-${x}-${y}`);
      cell.dataset.tooltip = `(${x}, ${y})`;
      switch (board[y][x].symbol) {
        case "🌳":
          cell.classList.add("tree");
          break;
        case "🍽️":
          cell.classList.add("food");
          break;
        case "X":
          cell.classList.add("dead-tree");
          break;
        case ".":
          cell.classList.add("empty");
      }
      cell.innerText = board[y][x].symbol;
      map.appendChild(cell);
    }
  }
}

function startGL() {
  log = document.getElementById("earth");
  dayCycleHaltButton = document.getElementById("day-cycle-halt");
  dayCycleHalt = false;
  dayCycleHaltButton.addEventListener("click", function () {
    dayCycleHalt = !dayCycleHalt;
    dayCycleHaltButton.innerHTML = dayCycleHalt
      ? '<span class="icon is-large"><i class="fa fa-play" aria-hidden="true"></i></span>'
      : '<span class="icon is-large"><i class="fa fa-pause" aria-hidden="true"></i></span>';
  });
  board = createBoard(rows, cols);
  populateMap();
  generateLogItem(log, "spawned", "Board", " created successfully.");
  populateLiveData();
}
