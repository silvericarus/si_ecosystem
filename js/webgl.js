let log;
let board;
let rows = 50;
let cols = 50;
let randomSizeOfForest = Math.floor(Math.random() * 50);
const forest = new Forest();

document.addEventListener("DOMContentLoaded", function () {
  start();
});

function treeGeneration() {
  let treesGenerated = 0;
  let lastPosition = [];
  for (let i = 0; i < randomSizeOfForest; i++) {
    for (let j = 0; j < canvasY; j++) {
      for (let k = 0; k < canvasX; k++) {
        if (treesGenerated >= randomSizeOfForest) {
          break;
        }
        //TODO - Fix the random generation of trees
        const x = Math.floor(Math.random() * cols) / 6;
        const y = Math.floor(Math.random() * rows) / 6;
        if (
          (Math.abs(lastPosition[0] - x) > 4 &&
            Math.abs(lastPosition[1] - y) > 4) ||
          treesGenerated === 0
        ) {
          let tree = new Tree("Oak", x, y, tileX, tileY);
          forest.addTree(tree);
          board[x][y] = "T";
          treesGenerated++;
          lastPosition = [x, y];
        }
      }
    }
  }
}

function start() {
  startGL();
  //treeGeneration();
}

function generateLogItem(element, log) {
  let card = document.createElement("div");
  card.classList.add("card");

  let cardContent = document.createElement("div");
  cardContent.classList.add("card-content");

  let content = document.createElement("div");
  content.classList.add("content");

  content.innerHTML = typeof element + " creado.<br/>";

  let time = document.createElement("time");

  let date = new Date();

  time.dateTime =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  time.innerText = date.toLocaleString();

  cardContent.appendChild(content);
  cardContent.appendChild(time);

  card.appendChild(cardContent);

  log.appendChild(card);
}

function createBoard(row, col) {
  let obj = new Array(row);
  for (let y = 0; y < col; y++) {
    obj[y] = new Array(col);
  }

  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      obj[y][x] = "#";
    }
  }
  return obj;
}

function startGL() {
  log = document.getElementById("earth");
  board = createBoard(rows, cols);
  console.log("board generado:", board);
  generateLogItem(board, log);
}
