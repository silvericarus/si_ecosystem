let log;
let board;
let dayCycleHaltButton;
let dayCycleHalt;
var liveTime;
let secondsFromStart;
let rows = 50;
let cols = 50;
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
    let tree = new Tree("Oak", x, y);
    forest.addTree(tree);
    board[x][y] = "T";
    treesGenerated++;
    generateLogItem(log, "spawned", tree.treeKind, ` at (${x}, ${y}).`);
  }
}

function start() {
  secondsFromStart = 0;
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
    const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
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
    case "warning":
      content.classList.add("has-text-warning");
      break;
    case "success":
      content.classList.add("has-text-success");
      break;
  }

  let time = document.createElement("time");

  let date = new Date();

  time.dateTime =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  const horas = Math.floor(secondsFromStart / 3600);
  const minutos = Math.floor((secondsFromStart % 3600) / 60);
  const segundosRestantes = secondsFromStart % 60;
  time.innerText = `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundosRestantes.toString().padStart(2, "0")}`;

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
      obj[y][x] = "#";
    }
  }
  return obj;
}

function populateLiveData() {
  liveTime = document.getElementById("time");
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
  generateLogItem(log, "spawned", "Board", " created successfully.");
  populateLiveData();
}
