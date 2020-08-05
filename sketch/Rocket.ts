interface Math {
	hypot(...n: number[]): number;
}

class Rocket implements SystemBody {
	bounds: Geometry.Rectangle;
	start: Geometry.Point;
	dead: boolean;
	diedOn: number;
	dna: p5.Vector[];
	fitness: number;
	mass: number = 0;
	acc: p5.Vector;

	constructor(x: number, y: number, dna?: p5.Vector[]) {
		this.bounds = new Geometry.Rectangle(x, y, 10, 20);
		this.start = new Geometry.Point(x, y);
		this.acc = createVector(0, 0);
		// this.vel = p5.Vector.random2D();
		// this.vel = p5.Vector.fromAngle(PI / 4);
		// this.vel.rotate(random(-PI / 4, PI / 4));

		this.dead = false;

		this.dna = [];
		if (!dna) {
			for (let i = 0; i < ITERATION_MAX; i++) {
				const nucleotide = p5.Vector.random2D();
				nucleotide.setMag(random(0, 3));
				this.dna.push(nucleotide);
			}
		} else {
			this.dna = dna;
		}
	}

	get pos() {
		return this.bounds.corner;
	}

	reset() {
		this.pos.x = this.start.x;
		this.pos.y = this.start.y;
		this.diedOn = 0;
		this.dead = false;
	}

	die() {
		this.dead = true;
		this.diedOn = iterations;
	}

	evaluate() {
		this.fitness =
			this.diedOn +
			10 *
				Math.hypot(
					this.start.x - this.pos.x,
					this.start.y - this.pos.y
				) -
			100 * (this.dead ? 1 : 0);
		return this.fitness;
	}

	static from(rocket: Rocket) {
		return new Rocket(rocket.pos.x, rocket.pos.y, rocket.dna);
	}

	get vel() {
		return this.dna[iterations];
	}

	update() {
		if (
			this.pos.x > width ||
			this.pos.x < 0 ||
			this.pos.y > height ||
			this.pos.y < 0
		)
			this.die();

		this.bounds.angle = this.vel.heading();

		if (!this.dead) {
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
		}

		for (const planet of planets) {
			if (this.intersects(planet)) {
				this.die();
				return;
			}
		}
	}

	applyForce(force: p5.Vector) {
		this.acc.add(force);
	}

	intersects(p: Planet): boolean {
		return p.bounds.intersects(this.bounds);
	}

	draw() {
		const hw = this.bounds.w / 2;
		const hl = this.bounds.h / 2;

		strokeWeight(1);
		stroke(0);

		push();
		translate(this.bounds.center.x, this.bounds.center.y);
		rotate(this.vel.heading());

		// Body
		fill(255);
		rect(-hl, -hw, this.bounds.h, this.bounds.w);

		// Tail
		fill(255, 0, 0);
		rect(-hl, -hw, -hw, this.bounds.w);
		// Head
		triangle(hl, -hw, hl, hw, this.bounds.h, 0);

		// Flame
		fill(255, 153, 0);
		triangle(-this.bounds.h - hw, 0, -hl - hw, -hw, -hl - hw, hw);

		// stroke(255, 0, 0);
		// line(0, 0, 10, 0);
		pop();
	}
}
