class Rocket {
	x: number;
	y: number;
	vel: p5.Vector;
	dead: boolean;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.vel = p5.Vector.random2D();

		this.dead = false;
	}

	update() {
		if (!this.dead) {
			this.x += this.vel.x;
			this.y += this.vel.y;
		}

		if (this.x > width || this.x < 0) this.dead = true;
		if (this.y > height || this.y < 0) this.dead = true;
	}

	draw() {
		const w = 10;
		const l = 20;
		const hw = w / 2;
		const hl = l / 2;

		strokeWeight(1);

		push();
		translate(this.x, this.y);
		rotate(this.vel.heading());

		// Body
		fill(255);
		rect(-hl, -hw, l, w);

		// Tail
		fill(255, 0, 0);
		rect(-hl, -hw, -hw, w);
		// Head
		triangle(hl, -hw, hl, hw, l, 0);

		// Flame
		fill(255, 153, 0);
		triangle(-l - hw, 0, -hl - hw, -hw, -hl - hw, hw);

		pop();
	}
}
