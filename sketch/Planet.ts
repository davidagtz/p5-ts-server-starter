class Planet implements SystemBody {
	bounds: Geometry.Circle;
	color: string;
	mass: number;
	vel: p5.Vector;
	acc: p5.Vector;
	start: {
		origin: Geometry.Point;
		vel: p5.Vector;
		acc: p5.Vector;
	};
	input: p5.Element;
	inputs: { [k: string]: p5.Element };

	get pos() {
		return this.bounds.center;
	}

	constructor(x: number, y: number, r: number, color: string) {
		x = Math.round(x);
		y = Math.round(y);

		this.bounds = new Geometry.Circle(x, y, r);
		this.color = color;

		this.mass = r;
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.start = {
			origin: this.bounds.center.copy(),
			vel: this.vel.copy(),
			acc: this.acc.copy(),
		};

		let info = createDiv();
		let xIn = createInput("x: ").value(x).parent(info);
		let yIn = createInput("y: ").value(y).parent(info);
		let cIn = createInput("color: ").value(color).parent(info);
		cIn.elt.onchange = function () {
			this.color = cIn.value();
		}.bind(this);
		this.inputs = {
			x: xIn,
			y: yIn,
			color: cIn,
		};

		this.input = info;
	}

	reset() {
		this.bounds.center = this.start.origin.copy();
		this.vel = this.start.vel.copy();
		this.acc = this.start.acc.copy();
	}

	moveStart(x: number, y: number) {
		x = Math.round(x);
		y = Math.round(y);
		this.bounds.center = new Geometry.Point(x, y);
		this.start.origin = this.bounds.center.copy();

		this.inputs.x.value(x);
		this.inputs.y.value(y);
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
