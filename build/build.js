var Batch = (function () {
    function Batch(size, x, y, rockets) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.rockets = [];
        this.x = x;
        this.y = y;
        if (!rockets) {
            for (var _ = 0; _ < size; _++) {
                this.rockets.push(new Rocket(x, y));
            }
        }
        else {
            this.rockets = rockets;
        }
    }
    Batch.prototype.isDead = function () {
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            if (!rocket.dead)
                return false;
        }
        return true;
    };
    Batch.prototype.draw = function () {
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            rocket.draw();
            noFill();
        }
    };
    Batch.prototype.evaluate = function () {
        var sorted = [];
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            var fitness = rocket.evaluate();
            if (sorted.length === 0) {
                sorted.push(rocket);
                continue;
            }
            for (var i = 0; i < sorted.length; i++) {
                if (fitness >= sorted[i].fitness) {
                    sorted.splice(i, 0, rocket);
                    break;
                }
            }
            if (sorted[sorted.length - 1].fitness > fitness) {
                sorted.push(rocket);
            }
        }
        return sorted;
    };
    return Batch;
}());
var Geometry;
(function (Geometry) {
    function lineIntersectsCircle(line, circle) {
        return false;
    }
    Geometry.lineIntersectsCircle = lineIntersectsCircle;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
        };
        Point.prototype.dist = function (p) {
            return Math.hypot(this.x - p.x, this.y - p.y);
        };
        Point.prototype.copy = function () {
            return new Point(this.x, this.y);
        };
        return Point;
    }());
    Geometry.Point = Point;
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
            this.corner = new Point(x, y);
            this.w = w;
            this.h = h;
            this.angle = angle;
        }
        Rectangle.prototype.intersects = function (b) {
            if (b.type === "circle") {
                return b.intersectRect(this);
            }
            return false;
        };
        Object.defineProperty(Rectangle.prototype, "center", {
            get: function () {
                return {
                    x: this.corner.x + this.w / 2,
                    y: this.corner.y + this.h / 2,
                };
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
            this.center = new Point(x, y);
            this.r = r;
        }
        Circle.prototype.intersects = function (b) {
            if (b.type === "rectangle") {
                return this.intersectRect(b);
            }
            else if (b.type === "circle") {
                return this.center.dist(b.center) < this.r + b.r;
            }
            return false;
        };
        Circle.prototype.intersectRect = function (rect) {
            var newPoint = Geometry.rotatePoint(this.center, rect.corner, rect.angle + PI / 2);
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
function createLabeledInput(label, options) {
    if (options === void 0) { options = {}; }
    var parent = createDiv();
    createElement("label", label).parent(parent);
    var input = createInput().value(options.value).parent(parent);
    if (options.onchange) {
        input.elt.onchange = function () {
            options.onchange(input);
        };
    }
    return parent;
}
var Planet = (function () {
    function Planet(x, y, r, color, name) {
        var _this = this;
        x = Math.round(x);
        y = Math.round(y);
        this.bounds = new Geometry.Circle(x, y, r);
        this.color = color;
        this.name = name !== null && name !== void 0 ? name : this.randomName();
        this.mass = r;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.start = {
            origin: this.bounds.center.copy(),
            vel: this.vel.copy(),
            acc: this.acc.copy(),
        };
        var info = createDiv();
        var nIn = createLabeledInput("name: ", {
            value: this.name,
            onchange: function (el) {
                _this.name = el.value();
            },
        }).parent(info);
        var xIn = createLabeledInput("x: ", {
            value: x,
            onchange: function (el) {
                _this.moveStart(parseInt(el.value(), 10), _this.start.origin.y);
            },
        }).parent(info);
        var yIn = createLabeledInput("y: ", {
            value: y,
            onchange: function (el) {
                _this.moveStart(_this.start.origin.x, parseInt(el.value(), 10));
            },
        }).parent(info);
        var mIn = createLabeledInput("mass: ", {
            value: this.mass,
            onchange: function (el) {
                _this.mass = parseInt(el.value(), 10);
            },
        }).parent(info);
        var cIn = createLabeledInput("color: ", {
            value: color,
            onchange: function (el) {
                _this.color = el.value();
            },
        }).parent(info);
        this.inputs = {
            x: xIn.child()[1],
            y: yIn.child()[1],
            color: cIn.child()[1],
            mass: mIn.child()[1],
        };
        this.input = info;
    }
    Object.defineProperty(Planet.prototype, "pos", {
        get: function () {
            return this.bounds.center;
        },
        enumerable: true,
        configurable: true
    });
    Planet.prototype.reset = function () {
        this.bounds.center = this.start.origin.copy();
        this.vel = this.start.vel.copy();
        this.acc = this.start.acc.copy();
    };
    Planet.prototype.moveStart = function (x, y) {
        x = Math.round(x);
        y = Math.round(y);
        this.start.origin = new Geometry.Point(x, y);
        if (iterations === 0) {
            this.bounds.center = this.start.origin.copy();
        }
        this.inputs.x.value = x;
        this.inputs.y.value = y;
    };
    Planet.prototype.applyForce = function (force) {
        this.acc.add(force);
    };
    Planet.prototype.draw = function () {
        var x = this.pos.x;
        var y = this.pos.y;
        var radius = this.bounds.r * 4 + 10;
        var isOutside = false;
        if (y < 0 || y > height) {
            y = Math.max(0, Math.min(y, height));
            isOutside = true;
            if (y <= 0)
                y += radius / 2;
            else
                y -= radius / 2;
        }
        if (x < 0 || x > width) {
            isOutside = true;
            x = Math.max(0, Math.min(x, width));
            if (x <= 0)
                x += radius / 2;
            else
                x -= radius / 2;
        }
        if (isOutside) {
            strokeWeight(5);
            stroke(127);
            noFill();
            circle(x, y, radius);
        }
        noStroke();
        fill(this.color);
        circle(x, y, this.bounds.r * 2);
        fill(255);
        textAlign(CENTER);
        textSize(this.bounds.r);
        text(this.name, x, y - this.bounds.r - 2);
        if (isOutside) {
            text(int(this.pos.x) + ", " + int(this.pos.y), x, y + 2 * this.bounds.r);
        }
    };
    Planet.prototype.randomName = function () {
        var name = "P-";
        for (var i = 0; i < 6; i++) {
            var char_1 = Math.floor(random(1, 37));
            if (char_1 <= 26) {
                name += String.fromCharCode(char_1 + 64);
            }
            else {
                name += String.fromCharCode(char_1 + 21);
            }
        }
        return name;
    };
    Planet.prototype.setMass = function (mass) {
        this.mass = mass;
        this.inputs.mass.value = mass;
    };
    Planet.prototype.intersects = function (body) {
        return this.bounds.intersects(body.bounds);
    };
    return Planet;
}());
var Rocket = (function () {
    function Rocket(x, y, dna) {
        this.mass = 0;
        this.bounds = new Geometry.Rectangle(x, y, 10, 20);
        this.start = new Geometry.Point(x, y);
        this.acc = createVector(0, 0);
        this.dead = false;
        this.dna = [];
        if (!dna) {
            for (var i = 0; i < ITERATION_MAX; i++) {
                var nucleotide = p5.Vector.random2D();
                nucleotide.setMag(random(0, 3));
                this.dna.push(nucleotide);
            }
        }
        else {
            this.dna = dna;
        }
    }
    Object.defineProperty(Rocket.prototype, "pos", {
        get: function () {
            return this.bounds.corner;
        },
        enumerable: true,
        configurable: true
    });
    Rocket.prototype.reset = function () {
        this.pos.x = this.start.x;
        this.pos.y = this.start.y;
        this.diedOn = 0;
        this.dead = false;
    };
    Rocket.prototype.die = function () {
        this.dead = true;
        this.diedOn = iterations;
    };
    Rocket.prototype.evaluate = function () {
        this.fitness =
            this.diedOn +
                10 *
                    Math.hypot(this.start.x - this.pos.x, this.start.y - this.pos.y) -
                100 * (this.dead ? 1 : 0);
        return this.fitness;
    };
    Rocket.from = function (rocket) {
        return new Rocket(rocket.pos.x, rocket.pos.y, rocket.dna);
    };
    Object.defineProperty(Rocket.prototype, "vel", {
        get: function () {
            return this.dna[iterations];
        },
        enumerable: true,
        configurable: true
    });
    Rocket.prototype.update = function () {
        if (this.pos.x > width ||
            this.pos.x < 0 ||
            this.pos.y > height ||
            this.pos.y < 0)
            this.die();
        this.bounds.angle = this.vel.heading();
        if (!this.dead) {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
        }
        for (var _i = 0, planets_1 = planets; _i < planets_1.length; _i++) {
            var planet = planets_1[_i];
            if (this.intersects(planet)) {
                this.die();
                return;
            }
        }
    };
    Rocket.prototype.moveStart = function (x, y) {
        this.start = new Geometry.Point(x, y);
        this.bounds.corner = this.start;
    };
    Rocket.prototype.applyForce = function (force) {
        this.acc.add(force);
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
var System = (function () {
    function System(G) {
        if (G === void 0) { G = 1; }
        this.G = G;
        this.bodies = [];
    }
    System.prototype.addBody = function (body) {
        this.bodies.push(body);
    };
    System.prototype.draw = function () {
        for (var _i = 0, _a = this.bodies; _i < _a.length; _i++) {
            var body = _a[_i];
            body.draw();
        }
        stroke(255, 0, 0);
        strokeWeight(5);
        point(this.centerOfMass().x, this.centerOfMass().y);
    };
    System.prototype.update = function () {
        for (var _i = 0, _a = this.bodies; _i < _a.length; _i++) {
            var body = _a[_i];
            for (var _b = 0, _c = this.bodies; _b < _c.length; _b++) {
                var m2 = _c[_b];
                if (body !== m2) {
                    var force = System.vectorBetween(body, m2);
                    force.setMag((this.G * m2.mass) / force.magSq());
                    body.applyForce(force);
                }
            }
        }
        for (var _d = 0, _e = this.bodies; _d < _e.length; _d++) {
            var body = _e[_d];
            for (var _f = 0, _g = this.bodies; _f < _g.length; _f++) {
                var m2 = _g[_f];
                if (body !== m2) {
                    if (body.intersects(m2)) {
                        var v3 = p5.Vector.mult(body.vel, body.mass);
                        v3.add(p5.Vector.mult(m2.vel, m2.mass));
                        v3.div(body.mass + m2.mass);
                        body.applyForce(p5.Vector.sub(v3, body.vel));
                        System.drawVector(body.pos, p5.Vector.sub(v3, body.vel));
                    }
                }
            }
        }
        for (var _h = 0, _j = this.bodies; _h < _j.length; _h++) {
            var body = _j[_h];
            body.vel.add(body.acc);
            body.pos.add(body.vel);
            body.acc.setMag(0);
        }
        iterations++;
    };
    System.drawVector = function (p, v) {
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
    };
    System.vectorBetween = function (origin, terminal) {
        var dx = terminal.pos.x - origin.pos.x;
        var dy = terminal.pos.y - origin.pos.y;
        return createVector(dx, dy);
    };
    System.prototype.reset = function () {
        for (var _i = 0, _a = this.bodies; _i < _a.length; _i++) {
            var body = _a[_i];
            body.reset();
        }
    };
    System.prototype.orbit = function (body, around) {
        var vel = System.vectorBetween(body, around);
        vel.rotate(PI / 2);
        vel.setMag(Math.sqrt((this.G * around.mass) / vel.mag()));
        body.vel = vel;
        if (body.start)
            body.start.vel = vel.copy();
    };
    System.prototype.centerOfMass = function () {
        var xbar = 0;
        var ybar = 0;
        var massSum = 0;
        for (var i = 0; i < this.bodies.length; i++) {
            massSum += this.bodies[i].mass;
            xbar += this.bodies[i].mass * this.bodies[i].pos.x;
            ybar += this.bodies[i].mass * this.bodies[i].pos.y;
        }
        return new Geometry.Point(xbar / massSum, ybar / massSum);
    };
    System.offset = function (body, from, dx, dy) {
        body.moveStart(from.pos.x + dx, from.pos.y + dy);
    };
    return System;
}());
var BIG_R;
var numBodies = 5;
var BATCH_SIZE = 16;
var iterations = 0;
var ITERATION_MAX = 300;
var hist = [];
var batch;
var planets;
var solarSystem;
var slider;
function setup() {
    var container = document.getElementById("canvas");
    var controls = document.getElementById("controls");
    var pcontrols = document.getElementById("planets");
    var canvas = createCanvas(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
    canvas.parent(container);
    BIG_R = width / 20;
    solarSystem = new System(2);
    var SUN = new Planet(width / 2, height / 2, BIG_R, "#ff0", "Sun");
    SUN.input.parent(pcontrols);
    SUN.setMass(BIG_R * 50);
    var MERCURY = new Planet(0, 0, BIG_R / 3, "#750", "Mercury");
    MERCURY.input.parent(pcontrols);
    System.offset(MERCURY, SUN, 0, height / 4);
    var VENUS = new Planet(0, 0, BIG_R / 3, "#070", "Venus");
    VENUS.input.parent(pcontrols);
    System.offset(VENUS, SUN, height / 3, 0);
    var EARTH = new Planet(0, 0, BIG_R / 2, "#13f", "Earth");
    EARTH.input.parent(pcontrols);
    System.offset(EARTH, SUN, 0, -height / 2);
    var MARS = new Planet(0, 0, BIG_R / 2, "#720", "Mars");
    MARS.input.parent(pcontrols);
    System.offset(MARS, SUN, -height / 2, 0);
    solarSystem.addBody(SUN);
    solarSystem.addBody(MERCURY);
    solarSystem.addBody(VENUS);
    solarSystem.addBody(EARTH);
    solarSystem.addBody(MARS);
    slider = createSlider(0, 10, solarSystem.G, 0.1).parent(controls);
    createButton("Restart")
        .mousePressed(function () {
        iterations = 0;
        solarSystem.reset();
        loop();
    })
        .parent(controls);
}
function draw() {
    solarSystem.G = slider.value();
    background(0);
    stroke(255);
    fill(255);
    textSize(height / 10);
    textAlign(LEFT);
    text(iterations, 10, height / 10);
    solarSystem.draw();
    solarSystem.update();
}
//# sourceMappingURL=build.js.map