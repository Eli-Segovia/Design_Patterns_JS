# Adapter

Its about getting the interface you want from the interface that you have

Its like the plug types across the world. USA vs UK have different power plugs. You can use an adapter to make the plug work for US connection.

## Implementation

Here is the situation. There is an api that only knows how to draw points. That's it. However, our application has complex objects such as Rectangles and lines. How do we use the API to draw our complex shapes? Come in Adapter :)

```js
// this our API. It's built around complex shapes
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    toString() {
        return `${this.start.toString()}→${this.end.toString()}`;
    }
}

class VectorObject extends Array {}

class VectorRectangle extends VectorObject {
    constructor(x, y, width, height) {
        super();
        this.push(new Line(new Point(x, y), new Point(x + width, y)));
        this.push(
            new Line(new Point(x + width, y), new Point(x + width, y + height))
        );
        this.push(new Line(new Point(x, y), new Point(x, y + height)));
        this.push(
            new Line(new Point(x, y + height), new Point(x + width, y + height))
        );
        this.push;
    }
}
// this is the api. It draws raster points.
let drawPoint = function (point) {
    process.stdout.write('.');
};

// Adapter
// We extend from Array because we want to keep track
// of the points within the class itself
// e.g. we want to do 'this.push(point)
class LineToPointAdapter extends Array {
    constructor(line) {
        super();
        console.log(
            `${LineToPointAdapter.count++}: Generating points for a line ${line.toString()}`
        );

        // Algorithm that makes points for the line
        let left = Math.min(line.start.x, line.end.x);
        let right = Math.max(line.start.x, line.end.x);
        let top = Math.min(line.start.y, line.end.y);
        let bottom = Math.max(line.start.y, line.end.y);

        if (right - left === 0) {
            for (let y = top; y <= bottom; ++y) {
                this.push(new Point(left, y));
            }
        } else if (line.end.y - line.start.y === 0) {
            for (let x = left; x <= right; ++x) {
                this.push(new Point(x, top));
            }
        }
    }
}
// static field to count points
LineToPointAdapter.count = 0;
```

Now that we have the adapter, we want to use to build the points in a line that form a vectorObject (like a rectangle).

```js
// some objects we want to draw. But we can only draw
// points. So we want to adapt them into points
let vectorObjects = [
    new VectorRectangle(1, 1, 10, 10),
    new VectorRectangle(3, 3, 6, 6),
];
let drawPoints = function (vectorObjects) {
    // go through the objects we want to draw
    // Each vector object self-contains lines
    for (let vo of vectorObjects)
        for (let line of vo) {
            // the adapter converts lines to points
            let adapter = new LineToPointAdapter(line);

            // (this is why we extended Array)
            // iterate through the generated points
            // and draw using the API, which does
            // understand Points
            adapter.forEach(drawPoint);
        }
};
```

## Adapter with caching

For the previous example it is possible that a point is regenerated even if we have already generated it with a previous line. There is a possiblity to do the same work over and over again as we build temporary objects to draw points.

For example:

```js
drawPoints();
drawPoints();
```

We would generate duplicate points each of these times

Caching helps solve this problem => store the temp points and reuse them.

I don't want to get too much into this point because I didn't really like the example provided in the course. I'm going to paste the code below for an example with caching:

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    toString() {
        return `${this.start.toString()}→${this.end.toString()}`;
    }
}

class VectorObject extends Array {}

class VectorRectangle extends VectorObject {
    constructor(x, y, width, height) {
        super();
        this.push(new Line(new Point(x, y), new Point(x + width, y)));
        this.push(
            new Line(new Point(x + width, y), new Point(x + width, y + height))
        );
        this.push(new Line(new Point(x, y), new Point(x, y + height)));
        this.push(
            new Line(new Point(x, y + height), new Point(x + width, y + height))
        );
        this.push;
    }
}

// ↑↑↑ this is your API ↑↑↑

// ↓↓↓ this is what you have to work with ↓↓↓
String.prototype.hashCode = function () {
    if (Array.prototype.reduce) {
        return this.split('').reduce(function (a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
    let hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i++) {
        const character = this.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
};

class LineToPointAdapter extends Array {
    constructor(line) {
        super();

        // sets the hash value for the line we receive
        this.hash = JSON.stringify(line).hashCode();

        // if the hash is in our cache, then we have already
        // processed this line before - our adapter has
        // already adapted the line and we have it stored
        // inside the adapter
        if (LineToPointAdapter.cache[this.hash]) return; // we already have it

        console.log(
            `${LineToPointAdapter.count++}: Generating ` +
                `points for line ${line.toString()} (with caching)`
        );

        // the temp points we generate
        let points = [];

        let left = Math.min(line.start.x, line.end.x);
        let right = Math.max(line.start.x, line.end.x);
        let top = Math.min(line.start.y, line.end.y);
        let bottom = Math.max(line.start.y, line.end.y);

        if (right - left === 0) {
            for (let y = top; y <= bottom; ++y) {
                points.push(new Point(left, y));
            }
        } else if (line.end.y - line.start.y === 0) {
            for (let x = left; x <= right; ++x) {
                points.push(new Point(x, top));
            }
        }
        // storeing the points in our cache for access
        LineToPointAdapter.cache[this.hash] = points;
    }

    // get the array of points for this instance
    // adapter's processed line
    get items() {
        return LineToPointAdapter.cache[this.hash];
    }
}
LineToPointAdapter.count = 0;
LineToPointAdapter.cache = {};

let vectorObjects = [
    new VectorRectangle(1, 1, 10, 10),
    new VectorRectangle(3, 3, 6, 6),
];

let drawPoint = function (point) {
    process.stdout.write('.');
};

let draw = function () {
    for (let vo of vectorObjects) {
        for (let line of vo) {
            let adapter = new LineToPointAdapter(line);
            adapter.items.forEach(drawPoint);
        }
    }
};

draw();
draw();
```

#### Takeaway

This tells us that sometimes adapters might generate duplicate items => we might want to keep a cache to prevent this behavior
