var canvas;
var cntxt;
var canvasX;
var canvasY;
var tileX, tileY;
var board;
var rows;
var cols;

function start() {
	startGL();
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
	canvasX = canvas.canvasWidth * 2;
	canvasY = canvas.canvasHeight * 2;
	cols = 300;
	rows = 150;
	tileX = Math.floor(canvasX / cols);
	tileY = Math.floor(canvasY / rows);
	board = create_board(rows, cols);
}