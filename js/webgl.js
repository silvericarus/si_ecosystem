let canvas;
let cntxt;
let canvasX;
let canvasY;
let tileX, tileY;
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
  drawBoard();
}

function create_board(row, col) {
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

function drawBoard() {
  console.table(board);
  let fragment = document.createDocumentFragment();
  board.forEach((row, y) => {
    row.forEach((tile, x) => {
      let cell = document.createElement("div");
      cell.id = `${y}-${x}`;
      cell.className = "cell";
      cell.style.gridColumn = x + 1;
      cell.style.gridRow = y + 1;
      cell.innerHTML = tile;
      cell.addEventListener("click", () => {
        alert(`Tile: ${y}-${x}`);
      });
      cell.style.cursor = "crosshair";
      fragment.appendChild(cell);
    });
  });
  canvas.appendChild(fragment);
}

function startGL() {
  canvas = document.getElementById("earth");
  initGL();
}

function initGL() {
  board = create_board(rows, cols);
}
