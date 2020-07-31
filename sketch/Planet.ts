class Planet {
	bounds: Geometry.Circle;
	color: string;

	get x() {
		return this.bounds.x;
	}
	get y() {
		return this.bounds.y;
	}

	constructor(x: number, y: number, r: number, color: string) {
		this.bounds = new Geometry.Circle(x, y, r);
		this.color = color;
	}

	draw() {
		noStroke();
		fill(this.color);
		circle(this.bounds.x, this.bounds.y, this.bounds.r * 2);
	}

	mass() {
		return this.bounds.r;
	}
}
