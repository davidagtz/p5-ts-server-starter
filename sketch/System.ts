interface SystemBody {
	mass: number;
	pos:
		| p5.Vector
		| {
				x: number;
				y: number;
				add: (v: p5.Vector) => void;
		  };
	acc: p5.Vector;
	vel: p5.Vector;

	applyForce: (v: p5.Vector) => void;
	draw: () => void;
	bounds: Geometry.Boundary;
}

class System {
	bodies: SystemBody[];
	G: number;
	constructor(G: number = 1) {
		this.G = G;
		this.bodies = [];
	}

	addBody(body: SystemBody) {
		this.bodies.push(body);
	}

	draw() {
		for (const body of this.bodies) {
			body.draw();
		}
	}

	update() {
		for (const body of this.bodies) {
			for (const m2 of this.bodies) {
				if (body !== m2) {
					const force = System.vectorBetween(body, m2);
					force.setMag((this.G * m2.mass) / force.magSq());

					body.applyForce(force);
				}
			}
		}

		// for (const body of this.bodies) {
		// 	for (const m2 of this.bodies) {
		// 		if (body !== m2) {
		// 			if (body.bounds.intersects(m2.bounds)) {
		// 				const vector = System.vectorBetween(body, m2);
		// 				vector.rotate(PI);
		// 				body.applyForce(vector.mult(0.5));
		// 				console.log("intersect");
		// 			}
		// 			console.log("no intersect");
		// 		}
		// 	}
		// }

		for (const body of this.bodies) {
			body.vel.add(body.acc);
			body.pos.add(body.vel);

			body.acc.setMag(0);
		}

		iterations++;
	}

	static vectorBetween(origin: SystemBody, terminal: SystemBody) {
		const dx = terminal.pos.x - origin.pos.x;
		const dy = terminal.pos.y - origin.pos.y;
		return createVector(dx, dy);
	}

	orbit(body: SystemBody, around: SystemBody) {
		const vel = System.vectorBetween(body, around);
		vel.rotate(PI / 2);
		vel.setMag(Math.sqrt((this.G * around.mass) / vel.mag()));

		body.vel = vel;
	}

	static offset(body: SystemBody, from: SystemBody, dx: number, dy: number) {
		body.pos.x = from.pos.x + dx;
		body.pos.y = from.pos.y + dy;
	}
}
