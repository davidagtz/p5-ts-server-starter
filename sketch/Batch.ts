class Batch {
	rockets: Rocket[];
	constructor(size: number, x: number = 0, y: number = 0) {
		this.rockets = [];

		for (let _ = 0; _ < size; _++) {
			this.rockets.push(new Rocket(x, y));
		}
	}

	setSpeed(speed: number) {
		for (const rocket of this.rockets) {
			rocket.setSpeed(speed);
		}
	}

	draw() {
		for (const rocket of this.rockets) {
			rocket.draw();
			noFill();
		}
	}

	update() {
		for (const rocket of this.rockets) {
			rocket.update();
		}
	}
}
