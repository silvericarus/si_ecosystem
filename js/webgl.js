var canvas;
var cntxt;
var canvasX;
var canvasY;
var tileX, tileY;
var board 
var rows;
var cols;
var randomSizeOfForest = Math.floor(Math.random() * 50);
const forest = new Forest();

function treeGeneration() {
	let treesGenerated = 0;
	let lastPosition = [];
	for(var i = 0; i < randomSizeOfForest; i++){
		for(var j = 0; j < canvasY; j++){
			for(var k = 0; k < canvasX; k++){
				if(treesGenerated >= randomSizeOfForest){
					break;
				}
				//TODO - Fix the random generation of trees
				const x = Math.floor(Math.random() * cols) / 6;
                const y = Math.floor(Math.random() * rows) / 6;
				if((Math.abs(lastPosition[0] - x) > 4 &&
					Math.abs(lastPosition[1] - y) > 4) ||
					treesGenerated === 0){
					let tree = new Tree("Oak", x, y, tileX, tileY);
					forest.addTree(tree);
					board[x][y] = 'T';
					treesGenerated++;
					lastPosition = [x, y];
				}
			}
		}
	}
	console.table(forest.trees);
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
	canvasWidth = 375;
	canvasHeight = 187;
	canvasX = canvasWidth * 2.5;
	canvasY = canvasHeight * 19;
	rows = 150;
	cols = 300;
	tileX = Math.floor(canvasX / rows);
	tileY = Math.floor(canvasY / cols);
	board = create_board(rows, cols);
}