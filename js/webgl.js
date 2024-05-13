var canvas;
var cntxt;
var canvasX;
var canvasY;
var tileX, tileY;
var board 
var rows = 150;
var cols = 300;
var randomSizeOfForest = Math.floor(Math.random() * 300);
const forest = new Forest();

function treeGeneration() {
	for(var i = 0; i < randomSizeOfForest; i++){
		for(var j = 0; j < rows; j++){
			for(var k = 0; k < cols; k++){
				const trueCheck = Math.random();
				if(trueCheck == 1 && board[j][k] === 'L'){
					board[j][k] = new Tree("Oak", j, k, tileX, tileY);
				}
			}
		}
	}
}

function start() {
	startGL();
	treeGeneration();
	trackSunMoonCycle(64, cntxt);
}

function create_board(row, col) {
	var obj = new Array(row);
	for (y = 0; y < col; y++) {
		obj[y] = new Array(col);
	}

	for (y = 0; y < row; y++) {
		for (x = 0; x < col; x++) {
			obj[y][x] = 'L';
		}
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
	tileX = Math.floor(canvasX / rows);
	tileY = Math.floor(canvasY / cols);
	board = create_board(rows, cols);
}