var Batch = (function () {
    function Batch(size, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.rockets = [];
        for (var _ = 0; _ < size; _++) {
            this.rockets.push(new Rocket(x, y));
        }
    }
    Batch.prototype.setSpeed = function (speed) {
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            rocket.setSpeed(speed);
        }
    };
    Batch.prototype.draw = function () {
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            rocket.draw();
            noFill();
        }
    };
    Batch.prototype.update = function () {
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            rocket.update();
        }
    };
    return Batch;
}());
var Geometry;
(function (Geometry) {
    function lineIntersectsCircle(line, circle) {
        return false;
    }
    Geometry.lineIntersectsCircle = lineIntersectsCircle;
    function rectangleInCircle(rect, circle) {
        return false;
    }
    Geometry.rectangleInCircle = rectangleInCircle;
    function rotatePoint(p, around, angle) {
        var dx = p.x - around.x;
        var dy = p.y - around.y;
        var ndx = dx * Math.cos(angle) - dy * Math.sin(angle);
        var ndy = dx * Math.sin(angle) + dy * Math.cos(angle);
        return {
            x: around.x + ndx,
            y: around.y + ndy,
        };
    }
    Geometry.rotatePoint = rotatePoint;
    var Rectangle = (function () {
        function Rectangle(x, y, w, h, angle) {
            if (angle === void 0) { angle = 0; }
            this.type = "rectangle";
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.angle = angle;
        }
        Object.defineProperty(Rectangle.prototype, "center", {
            get: function () {
                return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
            },
            enumerable: true,
            configurable: true
        });
        return Rectangle;
    }());
    Geometry.Rectangle = Rectangle;
    var Circle = (function () {
        function Circle(x, y, r) {
            this.type = "circle";
            this.x = x;
            this.y = y;
            this.r = r;
        }
        Object.defineProperty(Circle.prototype, "center", {
            get: function () {
                return {
                    x: this.x,
                    y: this.y,
                };
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.intersects = function (b) {
            if (b.type === "rectangle") {
                return this.intersectRect(b);
            }
            return false;
        };
        Circle.prototype.intersectRect = function (rect) {
            var newPoint = Geometry.rotatePoint(this.center, { x: rect.x, y: rect.y }, rect.angle + PI / 2);
            var dx = Math.abs(newPoint.x - rect.center.x);
            var dy = Math.abs(newPoint.y - rect.center.y);
            if (dx > this.r + rect.w / 2)
                return false;
            if (dy > this.r + rect.h / 2)
                return false;
            if (dx <= rect.w / 2)
                return true;
            if (dy <= rect.h / 2)
                return true;
            var dist = Math.hypot(dx - rect.w / 2, dy - rect.h / 2);
            return dist <= this.r;
        };
        return Circle;
    }());
    Geometry.Circle = Circle;
})(Geometry || (Geometry = {}));
var Planet = (function () {
    function Planet(x, y, r, color) {
        this.bounds = new Geometry.Circle(x, y, r);
        this.color = color;
    }
    Object.defineProperty(Planet.prototype, "x", {
        get: function () {
            return this.bounds.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Planet.prototype, "y", {
        get: function () {
            return this.bounds.y;
        },
        enumerable: true,
        configurable: true
    });
    Planet.prototype.draw = function () {
        noStroke();
        fill(this.color);
        circle(this.bounds.x, this.bounds.y, this.bounds.r * 2);
    };
    Planet.prototype.mass = function () {
        return this.bounds.r;
    };
    return Planet;
}());
var Rocket = (function () {
    function Rocket(x, y) {
        this.bounds = new Geometry.Rectangle(x, y, 10, 20);
        this.vel = p5.Vector.fromAngle(PI / 4);
        this.vel.rotate(random(-PI / 4, PI / 4));
        this.dead = false;
    }
    Object.defineProperty(Rocket.prototype, "x", {
        get: function () {
            return this.bounds.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rocket.prototype, "y", {
        get: function () {
            return this.bounds.y;
        },
        enumerable: true,
        configurable: true
    });
    Rocket.prototype.setSpeed = function (speed) {
        this.vel.setMag(speed);
    };
    Rocket.prototype.update = function () {
        if (this.bounds.x > width || this.bounds.x < 0)
            this.dead = true;
        if (this.bounds.y > height || this.bounds.y < 0)
            this.dead = true;
        this.bounds.angle = this.vel.heading();
        if (!this.dead) {
            this.bounds.x += this.vel.x;
            this.bounds.y += this.vel.y;
        }
        var acc = new p5.Vector();
        for (var _i = 0, planets_1 = planets; _i < planets_1.length; _i++) {
            var planet = planets_1[_i];
            if (this.intersects(planet)) {
                this.dead = true;
                return;
            }
            var gravity = createVector(planet.x - this.x, planet.y - this.y);
            gravity.setMag((G * planet.mass()) / (gravity.mag() * gravity.mag()));
            acc.add(gravity);
        }
        this.vel.x += acc.x;
        this.vel.y += acc.y;
    };
    Rocket.prototype.intersects = function (p) {
        return p.bounds.intersects(this.bounds);
    };
    Rocket.prototype.draw = function () {
        var hw = this.bounds.w / 2;
        var hl = this.bounds.h / 2;
        strokeWeight(1);
        stroke(0);
        push();
        translate(this.bounds.center.x, this.bounds.center.y);
        rotate(this.vel.heading());
        fill(255);
        rect(-hl, -hw, this.bounds.h, this.bounds.w);
        fill(255, 0, 0);
        rect(-hl, -hw, -hw, this.bounds.w);
        triangle(hl, -hw, hl, hw, this.bounds.h, 0);
        fill(255, 153, 0);
        triangle(-this.bounds.h - hw, 0, -hl - hw, -hw, -hl - hw, hw);
        pop();
    };
    return Rocket;
}());
var WIDTH = 800;
var HEIGHT = 600;
var BATCH_SIZE = 8;
var G = 5;
var hist = [];
var batch;
var planets;
var slider;
function setup() {
    createCanvas(WIDTH, HEIGHT);
    var BIG_R = width / 20;
    var W5 = width / 5;
    var H6 = height / 6;
    batch = new Batch(BATCH_SIZE, 4 * W5 + (2 * BIG_R) / 3, 2 * H6 + (2 * BIG_R) / 3);
    batch.setSpeed(2);
    var SUN = new Planet(W5, 5 * H6, BIG_R, "#ff0");
    var MERCURY = new Planet(2 * W5, 4 * H6, BIG_R / 3, "#750");
    var VENUS = new Planet(3 * W5, 3 * H6, BIG_R / 3, "#070");
    var EARTH = new Planet(4 * W5, 2 * H6, BIG_R / 2, "#13f");
    var MARS = new Planet(5 * W5, 1 * H6, BIG_R / 2, "#720");
    planets = [SUN, MERCURY, VENUS, EARTH, MARS];
    slider = createSlider(0, 10, G, 0.1);
    createButton("Restart").mousePressed(function () {
        batch = new Batch(BATCH_SIZE, width / 2, height / 3);
    });
}
function draw() {
    G = slider.value();
    background(0);
    for (var _i = 0, planets_2 = planets; _i < planets_2.length; _i++) {
        var planet = planets_2[_i];
        planet.draw();
        strokeWeight(5);
        stroke(255, 0, 0);
    }
    batch.draw();
    batch.update();
}
function windowResized() {
    createCanvas(WIDTH, HEIGHT);
}
//# sourceMappingURL=build.js.map