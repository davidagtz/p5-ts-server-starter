function createLabeledInput(
	label: string,
	options: { value?: any; onchange?: (el: p5.Element) => void } = {}
) {
	const parent = createDiv();
	createElement("label", label).parent(parent);
	const input = createInput().value(options.value).parent(parent);
	if (options.onchange) {
		input.elt.onchange = () => {
			options.onchange(input);
		};
	}
	return parent;
}

class Planet implements SystemBody {
	bounds: Geometry.Circle;
	color: string;
	name: string;
	mass: number;
	vel: p5.Vector;
	acc: p5.Vector;
	start: {
		origin: Geometry.Point;
		vel: p5.Vector;
		acc: p5.Vector;
	};
	input: p5.Element;
	inputs: { [k: string]: Node };

	get pos() {
		return this.bounds.center;
	}

	constructor(x: number, y: number, r: number, color: string, name?: string) {
		x = Math.round(x);
		y = Math.round(y);

		this.bounds = new Geometry.Circle(x, y, r);
		this.color = color;
		this.name = name ?? this.randomName();

		this.mass = r;
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.start = {
			origin: this.bounds.center.copy(),
			vel: this.vel.copy(),
			acc: this.acc.copy(),
		};

		let info = createDiv();

		let nIn = createLabeledInput("name: ", {
			value: this.name,
			onchange: (el) => {
				this.name = el.value() as string;
			},
		}).parent(info);

		let xIn = createLabeledInput("x: ", {
			value: x,
			onchange: (el) => {
				this.moveStart(
					parseInt(el.value() as string, 10),
					this.start.origin.y
				);
			},
		}).parent(info);

		let yIn = createLabeledInput("y: ", {
			value: y,
			onchange: (el) => {
				this.moveStart(
					this.start.origin.x,
					parseInt(el.value() as string, 10)
				);
			},
		}).parent(info);

		let mIn = createLabeledInput("mass: ", {
			value: this.mass,
			onchange: (el) => {
				this.mass = parseInt(el.value() as string, 10);
			},
		}).parent(info);

		let cIn = createLabeledInput("color: ", {
			value: color,
			onchange: (el) => {
				this.color = el.value() as string;
			},
		}).parent(info);

		this.inputs = {
			x: xIn.child()[1],
			y: yIn.child()[1],
			color: cIn.child()[1],
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
		this.start.origin = new Geometry.Point(x, y);

		if (iterations === 0) {
			this.bounds.center = this.start.origin.copy();
		}

		(this.inputs.x as any).value = x;
		(this.inputs.y as any).value = y;
	}

	applyForce(force: p5.Vector) {
		this.acc.add(force);
	}

	draw() {
		noStroke();
		fill(this.color);
		circle(this.pos.x, this.pos.y, this.bounds.r * 2);

		fill(255);
		textAlign(CENTER);
		textSize(this.bounds.r);
		text(this.name, this.pos.x, this.pos.y - this.bounds.r - 2);
	}

	randomName() {
		let name = "P-";
		for (let i = 0; i < 6; i++) {
			let char = Math.floor(random(1, 37));
			if (char <= 26) {
				name += String.fromCharCode(char + 64);
			} else {
				name += String.fromCharCode(char + 21);
			}
		}
		return name;
	}
}
