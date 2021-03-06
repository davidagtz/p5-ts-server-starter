let BIG_R: number;
const numBodies = 5;

// Must be power of two
const BATCH_SIZE = 16;
let iterations = 0;
const ITERATION_MAX = 300;
let hist: Batch[] = [];
let batch: Batch;
let planets: Planet[];
let solarSystem: System;

let slider: p5.Element;

function setup() {
	const container = document.getElementById("canvas");
	const controls = document.getElementById("controls");
	const pcontrols = document.getElementById("planets");

	const canvas = createCanvas(
		container.getBoundingClientRect().width,
		container.getBoundingClientRect().height
	);
	canvas.parent(container);
	BIG_R = width / 20;

	solarSystem = new System(2);

	// batch = new Batch(
	// 	BATCH_SIZE,
	// 	4 * WS + (2 * BIG_R) / 3,
	// 	2 * HS + (2 * BIG_R) / 3
	// );

	const SUN = new Planet(width / 2, height / 2, BIG_R, "#ff0", "Sun");
	SUN.input.parent(pcontrols);
	SUN.setMass(BIG_R * 50);

	const MERCURY = new Planet(0, 0, BIG_R / 3, "#750", "Mercury");
	MERCURY.input.parent(pcontrols);
	System.offset(MERCURY, SUN, 0, height / 4);

	const VENUS = new Planet(0, 0, BIG_R / 3, "#070", "Venus");
	VENUS.input.parent(pcontrols);
	System.offset(VENUS, SUN, height / 3, 0);

	const EARTH = new Planet(0, 0, BIG_R / 2, "#13f", "Earth");
	EARTH.input.parent(pcontrols);
	System.offset(EARTH, SUN, 0, -height / 2);

	const MARS = new Planet(0, 0, BIG_R / 2, "#720", "Mars");
	MARS.input.parent(pcontrols);
	System.offset(MARS, SUN, -height / 2, 0);

	// solarSystem.orbit(MERCURY, SUN);
	// solarSystem.orbit(VENUS, SUN);
	// solarSystem.orbit(EARTH, SUN);
	// solarSystem.orbit(MARS, SUN);

	solarSystem.addBody(SUN);
	solarSystem.addBody(MERCURY);
	solarSystem.addBody(VENUS);
	solarSystem.addBody(EARTH);
	solarSystem.addBody(MARS);

	slider = createSlider(0, 10, solarSystem.G, 0.1).parent(controls);

	createButton("Restart")
		.mousePressed(() => {
			// batch = new Batch(BATCH_SIZE, width / 2, height / 3);
			iterations = 0;
			solarSystem.reset();
			loop();
		})
		.parent(controls);
}

function draw() {
	solarSystem.G = slider.value() as number;
	background(0);

	stroke(255);
	fill(255);
	textSize(height / 10);
	textAlign(LEFT);
	text(iterations, 10, height / 10);

	solarSystem.draw();
	solarSystem.update();

	// if (batch.isDead() || iterations >= ITERATION_MAX - 1) {
	// 	hist.push(batch);

	// 	noLoop();

	// 	const sorted = batch.evaluate();
	// 	const ratio = Math.pow(2, 2);
	// 	const chunk = sorted.length / ratio;
	// 	const newGenepool = sorted.slice(0, chunk);
	// 	let newGeneration: Rocket[] = newGenepool.map((e) => Rocket.from(e));
	// 	for (let i = 0; i < newGenepool.length; i++) {
	// 		const copies = Math.ceil(
	// 			(sorted.length - newGenepool.length) / Math.pow(2, i + 1)
	// 		);
	// 		console.log(copies, i);
	// 		for (let _ = 0; _ < copies; _++) {
	// 			newGeneration.push(Rocket.from(newGenepool[i]));
	// 		}
	// 	}

	// 	console.log(newGeneration.length);

	// 	batch = new Batch(
	// 		BATCH_SIZE,
	// 		4 * WS + (2 * BIG_R) / 3,
	// 		2 * HS + (2 * BIG_R) / 3,
	// 		newGeneration
	// 	);
	// 	iterations = 0;

	// 	console.log(sorted);
	// 	console.log(newGeneration);
	// 	// loop();

	// 	return;
	// }
}

// // p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
// function windowResized() {
// 	createCanvas(WIDTH, HEIGHT);
// }
