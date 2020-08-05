class Batch {
	rockets: Rocket[];
	x: number;
	y: number;
	constructor(
		size: number,
		x: number = 0,
		y: number = 0,
		rockets?: Rocket[]
	) {
		this.rockets = [];
		this.x = x;
		this.y = y;

		if (!rockets) {
			for (let _ = 0; _ < size; _++) {
				this.rockets.push(new Rocket(x, y));
			}
		} else {
			this.rockets = rockets;
		}
	}

	isDead() {
		for (const rocket of this.rockets) {
			if (!rocket.dead) return false;
		}
		return true;
	}

	// setSpeed(speed: number) {
	// 	for (const rocket of this.rockets) {
	// 		rocket.setSpeed(speed);
	// 	}
	// }

	draw() {
		for (const rocket of this.rockets) {
			rocket.draw();
			noFill();
		}
	}

	evaluate() {
		const sorted = [];
		for (const rocket of this.rockets) {
			const fitness = rocket.evaluate();

			if (sorted.length === 0) {
				sorted.push(rocket);
				continue;
			}

			for (let i = 0; i < sorted.length; i++) {
				if (fitness >= sorted[i].fitness) {
					sorted.splice(i, 0, rocket);
					break;
				}
			}
			if (sorted[sorted.length - 1].fitness > fitness) {
				sorted.push(rocket);
			}
		}

		return sorted;
	}
}
