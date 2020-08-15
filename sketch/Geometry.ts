namespace Geometry {
	export function lineIntersectsCircle(line: Line, circle: Circle): boolean {
		return false;
	}

	interface Line {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}

	export class Point {
		x: number;
		y: number;

		constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
		}

		add(v: p5.Vector) {
			this.x += v.x;
			this.y += v.y;
		}

		dist(p: Point) {
			return Math.hypot(this.x - p.x, this.y - p.y);
		}

		copy() {
			return new Point(this.x, this.y);
		}
	}

	export function rotatePoint(p: Point, around: Point, angle: number) {
		const dx = p.x - around.x;
		const dy = p.y - around.y;

		const ndx = dx * Math.cos(angle) - dy * Math.sin(angle);
		const ndy = dx * Math.sin(angle) + dy * Math.cos(angle);

		return {
			x: around.x + ndx,
			y: around.y + ndy,
		};
	}

	export type Boundary = Rectangle | Circle;

	export class Rectangle {
		corner: Point;
		w: number;
		h: number;
		angle: number;
		type: "rectangle" = "rectangle";
		constructor(
			x: number,
			y: number,
			w: number,
			h: number,
			angle: number = 0
		) {
			this.corner = new Point(x, y);
			this.w = w;
			this.h = h;
			this.angle = angle;
		}

		intersects(b: Boundary) {
			if (b.type === "circle") {
				return b.intersectRect(this);
			}
			return false;
		}

		get center() {
			return {
				x: this.corner.x + this.w / 2,
				y: this.corner.y + this.h / 2,
			};
		}
	}

	export class Circle {
		center: Point;
		r: number;
		type: "circle" = "circle";
		constructor(x: number, y: number, r: number) {
			this.center = new Point(x, y);
			this.r = r;
		}

		intersects(b: Boundary): boolean {
			if (b.type === "rectangle") {
				return this.intersectRect(b);
			} else if (b.type === "circle") {
				return this.center.dist(b.center) < this.r + b.r;
			}
			return false;
		}

		intersectRect(rect: Rectangle): boolean {
			/* See if center in rect
			 *   A-B
			 *   | |
			 *   D-C
			 *
			 * 	/ - \
			 * 	| P |
			 * 	\ - /
			 */

			const newPoint = Geometry.rotatePoint(
				this.center,
				rect.corner,
				rect.angle + PI / 2
			);
			// if (newPoint.x < rect.x || newPoint.x > rect.x + rect.w)
			// 	return false;
			// if (newPoint.y < rect.y || newPoint.y > rect.y + rect.h)
			// 	return false;
			const dx = Math.abs(newPoint.x - rect.center.x);
			const dy = Math.abs(newPoint.y - rect.center.y);
			// strokeWeight(2);
			// stroke(255, 0, 0);
			// circle(newPoint.x, newPoint.y, this.r);

			if (dx > this.r + rect.w / 2) return false;
			if (dy > this.r + rect.h / 2) return false;

			if (dx <= rect.w / 2) return true;
			if (dy <= rect.h / 2) return true;

			const dist = Math.hypot(dx - rect.w / 2, dy - rect.h / 2);

			return dist <= this.r;
		}
	}
}
