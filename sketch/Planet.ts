class Planet implements SystemBody {
	bounds: Geometry.Circle;
	color: string;
	mass: number;
	vel: p5.Vector;
	acc: p5.Vector;

	get pos() {
		return this.bounds.center;
	}

	constructor(x: number, y: number, r: number, color: string) {
		this.bounds = new Geometry.Circle(x, y, r);
		this.color = color;

		this.mass = r;
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
	}

	applyForce(force: p5.Vector) {
		this.acc.add(force);
	}

	draw() {
		noStroke();
		fill(this.color);
		circle(this.pos.x, this.pos.y, this.bounds.r * 2);
	}
}
