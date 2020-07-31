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

	const BIG_R = width / 20;
	const W5 = width / 5;
	const H6 = height / 6;

	batch = new Batch(
		BATCH_SIZE,
		4 * W5 + (2 * BIG_R) / 3,
		2 * H6 + (2 * BIG_R) / 3
	);
	batch.setSpeed(2);

	const SUN = new Planet(W5, 5 * H6, BIG_R, "#ff0");
	const MERCURY = new Planet(2 * W5, 4 * H6, BIG_R / 3, "#750");
	const VENUS = new Planet(3 * W5, 3 * H6, BIG_R / 3, "#070");
	const EARTH = new Planet(4 * W5, 2 * H6, BIG_R / 2, "#13f");
	const MARS = new Planet(5 * W5, 1 * H6, BIG_R / 2, "#720");

	planets = [SUN, MERCURY, VENUS, EARTH, MARS];

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
