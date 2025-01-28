let canvas;
let cntxt;
let canvasX;
let canvasY;
let tileX, tileY;
let board;
let rows = 1_000;
let cols = 1_000;
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

async function start() {
  startGL();
  //treeGeneration();
  await drawBoard();
}

function create_board(row, col) {
  let obj = new Array(row);
  for (let y = 0; y < col; y++) {
    obj[y] = new Array(col);
  }

  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      obj[y][x] = "L";
    }
  }
  return obj;
}

async function drawBoard() {
  let cell;
  board.forEach((row, y) => {
    row.forEach((tile, x) => {
      cell = document.createElement("div");
      cell.id = `${y}-${x}`;
      cell.style = `grid-column: ${x + 1}; grid-row: ${y + 1};`;
      cell.innerHTML = "#";
      earth.appendChild(cell);
    });
  });
}

function startGL() {
  canvas = document.getElementById("earth");
  initGL();
}

function initGL() {
  board = create_board(rows, cols);
}
