# Where would we use Factory Method???

### Let's see an example

Here we have a cartesian cooridnate geometry point `Point`

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
```

Now let's say that we want to add a polar coordinate feature to this... We can't just go in and a a second constructor:

```js
class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    constructor(rho, theta){
        this.x = rho * Math.cos(theta);
        this.y = rho * Math.sin(theta);
    }
}
```

So what do we do??? If we just want one constructor that handles all the possibilities, that will be crazy :(

e.g.

```js
CoordinateSystem = Object.freeze({
    cartesian: 0,
    polar: 1
});
class Point {
    constructor(a, b, coordinateSystem) {
        switch (coordinateSystem) {
            case coordinateSystem.cartesian:
                this.x = a;
                this.y = b;
                break;
            case coordinateSystem.polar:
                this.x = rho * Math.cos(theta);
                this.y = rho * Math.sin(theta);
                break;
        }
    }
}
```

But this here gets ugly because the `a` and `b` labels are not descriptive. If we wanted to add a third coordinate system, you would need to add the enum, and add another switch case which is just hairy.

## Come in: Factory Method

Method that allows you to create an object. Doesn't need to be called Constructor!

```js
class Point {
    // We want to keep a good general constructor here
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Here we have a static method that just wraps over the constructor method
    // This is a Factory method :)
    static newCartesianPoint(x, y) {
        return new Point(x, y);
    }

    // what about Polar???

    static newPolarPoint(rho, theta) {
        return new Point(rho * Math.cos(theta), rho * Math.sin(theta));
    }
}

// old version:
// let p1 = new Point(2, 3, coordinateSystem.cartesian)

// using Factory Method: much cleaner :)
let p = Point.newCartesianPoint(4, 5);
```
