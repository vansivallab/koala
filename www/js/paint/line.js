function Line() {
}

Line.prototype = new Pair();
Line.prototype.constuctor = Line;
Line.prototype.getLength = function () {
    var l1 = this.x2 - this.x1;
    var l2 = this.y2 - this.y1;
    return Math.sqrt(l1 * l1 + l2 * l2);
};