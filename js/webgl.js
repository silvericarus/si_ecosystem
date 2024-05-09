var canvas;
var cntxt;
var canvasX;
var canvasY;
var tileX, tileY;
var board;
var rows;
var cols;
var randomSizeOfForest = Math.floor(Math.random() * 300);
const forest = new Forest();

function start() {
	startGL();
	for(var i = 0; i < randomSizeOfForest; i++){
		forest.addTree(new Tree("Oak", Math.floor(Math.random() * rows), Math.floor(Math.random() * cols), tileX, tileY));
	}
	// forest.addTree(new Tree("Oak", 1, 1, tileX, tileY));
	// forest.addTree(new Tree("Pine", 5, 5, tileX, tileY));
	console.table(forest.trees);
	trackSunMoonCycle(64, cntxt);
}

function create_board(row, col) {
	var obj = new Array(row);
	for (y = 0; y < col; y++) {
		obj[y] = new Array(col);
	}
	return obj;
}

function startGL() {
	canvas = document.getElementById("earth");
	initGL(canvas);
}

function initGL(canvas) {
	cntxt = canvas.getContext("2d");
	canvasWidth = canvas.clientWidth;
	canvasHeight = canvas.clientHeight;
	canvasX = canvasWidth * 2;
	canvasY = canvasHeight * 2;
	cols = 300;
	rows = 150;
	tileX = Math.floor(canvasX / rows);
	tileY = Math.floor(canvasY / cols);
	board = create_board(rows, cols);
}