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
	bounds: Geometry.Boundary;
	start?: any;

	intersects: (body: SystemBody) => boolean;
	applyForce: (v: p5.Vector) => void;
	draw: () => void;
	reset: () => void;
	moveStart: (x: number, y: number) => void;
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

		stroke(255, 0, 0);
		strokeWeight(5);
		point(this.centerOfMass().x, this.centerOfMass().y);
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

		for (const body of this.bodies) {
			for (const m2 of this.bodies) {
				if (body !== m2) {
					if (body.intersects(m2)) {
						const v3 = p5.Vector.mult(body.vel, body.mass);
						v3.add(p5.Vector.mult(m2.vel, m2.mass));
						v3.div(body.mass + m2.mass);
						// body.vel = v3.copy();
						// m2.vel = v3.copy();
						// System.drawVector(body.pos, v3);
						body.applyForce(p5.Vector.sub(v3, body.vel));
						System.drawVector(
							body.pos,
							p5.Vector.sub(v3, body.vel)
						);
						// console.log(body.pos);
						// noLoop();

						// body.applyForce(vector);
						// noLoop();
						// const vector = System.vectorBetween(body, m2);
						// const rvel = p5.Vector.sub(m2.vel, body.vel);
						// vector.rotate(PI / 2);
						// // Projection
						// vector.mult(rvel.dot(vector) / vector.magSq());
						// vector.sub(rvel).mult(-1);
						// // vector.div(body.mass);
						// // vector.mult(1000);
						// console.log(vector.mag());
						// System.drawVector(
						// 	body.pos.x,
						// 	body.pos.y,
						// 	vector
						// 	// p5.Vector.fromAngle(vector.heading()).mult(10)
						// );
						// body.applyForce(vector);
						// noLoop();
					}
				}
			}
		}

		for (const body of this.bodies) {
			body.vel.add(body.acc);
			body.pos.add(body.vel);

			body.acc.setMag(0);
		}

		iterations++;
	}

	static drawVector(p: { x: number; y: number }, v: p5.Vector) {
		strokeWeight(1);
		stroke(255, 0, 0);
		push();
		translate(p.x, p.y);
		line(0, 0, v.x, v.y);

		translate(v.x, v.y);

		rotate(PI / 6 + v.heading());
		line(0, 0, 0, 5);
		rotate((2 * PI) / 3);
		line(0, 0, 0, 5);
		pop();
	}

	static vectorBetween(origin: SystemBody, terminal: SystemBody) {
		const dx = terminal.pos.x - origin.pos.x;
		const dy = terminal.pos.y - origin.pos.y;
		return createVector(dx, dy);
	}

	reset() {
		for (const body of this.bodies) {
			body.reset();
		}
	}

	orbit(body: SystemBody, around: SystemBody) {
		const vel = System.vectorBetween(body, around);
		vel.rotate(PI / 2);
		vel.setMag(Math.sqrt((this.G * around.mass) / vel.mag()));

		body.vel = vel;
		if (body.start) body.start.vel = vel.copy();
	}

	centerOfMass(): Geometry.Point {
		let xbar = 0;
		let ybar = 0;
		let massSum = 0;
		for (let i = 0; i < this.bodies.length; i++) {
			massSum += this.bodies[i].mass;
			xbar += this.bodies[i].mass * this.bodies[i].pos.x;
			ybar += this.bodies[i].mass * this.bodies[i].pos.y;
		}

		return new Geometry.Point(xbar / massSum, ybar / massSum);
	}

	static offset(body: SystemBody, from: SystemBody, dx: number, dy: number) {
		body.moveStart(from.pos.x + dx, from.pos.y + dy);
	}
}
