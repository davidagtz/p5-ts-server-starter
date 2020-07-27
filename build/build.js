var Rocket = (function () {
    function Rocket(x, y) {
        this.x = x;
        this.y = y;
        this.vel = p5.Vector.random2D();
        this.dead = false;
    }
    Rocket.prototype.update = function () {
        if (!this.dead) {
            this.x += this.vel.x;
            this.y += this.vel.y;
        }
        if (this.x > width || this.x < 0)
            this.dead = true;
        if (this.y > height || this.y < 0)
            this.dead = true;
    };
    Rocket.prototype.draw = function () {
        var w = 10;
        var l = 20;
        var hw = w / 2;
        var hl = l / 2;
        strokeWeight(1);
        push();
        translate(this.x, this.y);
        rotate(this.vel.heading());
        fill(255);
        rect(-hl, -hw, l, w);
        fill(255, 0, 0);
        rect(-hl, -hw, -hw, w);
        triangle(hl, -hw, hl, hw, l, 0);
        fill(255, 153, 0);
        triangle(-l - hw, 0, -hl - hw, -hw, -hl - hw, hw);
        pop();
    };
    return Rocket;
}());
var Batch = (function () {
    function Batch(size, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.rockets = [];
        for (var _ = 0; _ < size; _++) {
            this.rockets.push(new Rocket(x, y));
        }
    }
    Batch.prototype.draw = function () {
        for (var _i = 0, _a = this.rockets; _i < _a.length; _i++) {
            var rocket = _a[_i];
            rocket.draw();
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
var WIDTH = 800;
var HEIGHT = 600;
var BATCH_SIZE = 32;
var hist = [];
var batch;
function setup() {
    createCanvas(WIDTH, HEIGHT);
    batch = new Batch(BATCH_SIZE, width / 3, (2 * height) / 3);
}
function draw() {
    background(0);
    batch.draw();
    batch.update();
}
function windowResized() {
    createCanvas(WIDTH, HEIGHT);
}
//# sourceMappingURL=build.js.map