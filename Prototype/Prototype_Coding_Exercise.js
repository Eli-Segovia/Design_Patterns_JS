// Prototype Coding Exercise
// Given the definitions shown in code, you are asked
// to implement Line.deepCopy()  to perform a deep
// copy of the given Line  object. This method should
// return a copy of a Line that contains copies of its
// start/end points.
class Point {
    /**
     * @param {number}  x - The x coordinate of the point
     * @param {number} y - The y coordinate of the point
     * @return {Point} Returns a Point
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @return {Point} Returns a copy of this Point
     */
    deepCopy() {
        return new Point(this.x, this.y);
    }
    /**
     * @return {string} Returns a string version of this object
     */
    toString() {
        return `(${this.x},${this.y})`;
    }
}

class Line {
    /**
     * @param {Point}  start - The start of the line
     * @param {Point} end - The end of the line
     * @return {Line} Returns a Line
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    /**
     * @return {Line} Returns a copy of this Line
     */
    deepCopy() {
        return new Line(this.start.deepCopy(), this.end.deepCopy());
    }

    /**
     * @return {string} Returns a string version of this object
     */
    toString() {
        return `A line that starts at ${this.start.toString()} and ends at ${this.end.toString()}`;
    }
}

let p1 = new Point(2, 4);
let p2 = new Point(5, 7);

let line1 = new Line(p1, p2);
let line2 = line1.deepCopy();
line2.start = new Point(6, 2);
line2.end = new Point(0, 0);

console.log(line1.toString());
console.log(line2.toString());
