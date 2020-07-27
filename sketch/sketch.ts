const WIDTH = 800;
const HEIGHT = 600;

const BATCH_SIZE = 32;
let hist: Batch[] = [];
let batch: Batch;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	batch = new Batch(BATCH_SIZE, width / 3, (2 * height) / 3);
}

function draw() {
	background(0);
	batch.draw();
	batch.update();
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
	createCanvas(WIDTH, HEIGHT);
}
