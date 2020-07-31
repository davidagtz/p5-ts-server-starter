const WIDTH = 800;
const HEIGHT = 600;

const BATCH_SIZE = 8;
let G = 5;
let hist: Batch[] = [];
let batch: Batch;
let planets: Planet[];

let slider: p5.Element;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	batch = new Batch(BATCH_SIZE, width / 2, height / 3);

	planets = [];
	planets.push(new Planet(width / 4, height / 2, width / 20, "#ff0"));
	planets.push(new Planet((3 * width) / 4, height / 2, width / 20, "#ff0"));

	slider = createSlider(0, 10, G, 0.1);

	createButton("Restart").mousePressed(() => {
		batch = new Batch(BATCH_SIZE, width / 2, height / 3);
	});
}

function draw() {
	G = slider.value() as number;
	background(0);

	for (const planet of planets) {
		planet.draw();
		strokeWeight(5);
		stroke(255, 0, 0);
	}

	batch.draw();
	batch.update();
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
	createCanvas(WIDTH, HEIGHT);
}
