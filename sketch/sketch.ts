let WIDTH = 800;
const HEIGHT = 600;

function setup() {
	WIDTH = windowWidth;
	createCanvas(WIDTH, HEIGHT);
}

function draw() {
	background(0);
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
	createCanvas(WIDTH, HEIGHT);
}
