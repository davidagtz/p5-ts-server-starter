interface Math {
	hypot(...n: number[]): number;
}

class Rocket {
	bounds: Geometry.Rectangle;
	vel: p5.Vector;
	dead: boolean;

	get x() {
		return this.bounds.x;
	}
	get y() {
		return this.bounds.y;
	}

	constructor(x: number, y: number) {
		this.bounds = new Geometry.Rectangle(x, y, 10, 20);
		// this.vel = p5.Vector.random2D();
		this.vel = p5.Vector.fromAngle(PI / 2);
		this.vel.rotate(random(-PI / 4, PI / 4));

		this.dead = false;
	}

	update() {
		this.bounds.angle = this.vel.heading();

		if (!this.dead) {
			this.bounds.x += this.vel.x;
			this.bounds.y += this.vel.y;
		}

		const acc = new p5.Vector();
		for (const planet of planets) {
			if (this.intersects(planet)) {
				this.dead = true;
				return;
			}
			const gravity = createVector(planet.x - this.x, planet.y - this.y);
			gravity.setMag(
				(G * planet.mass()) / (gravity.mag() * gravity.mag())
			);
			acc.add(gravity);
		}

		this.vel.x += acc.x;
		this.vel.y += acc.y;

		if (this.bounds.x > width || this.bounds.x < 0) this.dead = true;
		if (this.bounds.y > height || this.bounds.y < 0) this.dead = true;
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
