function Rect() {
}

Rect.prototype = new Pair();
Rect.prototype.constructor = Rect;
Rect.prototype.getArea = function () {
    return (this.x2-this.x1) * (this.y2 - this.y1);
};