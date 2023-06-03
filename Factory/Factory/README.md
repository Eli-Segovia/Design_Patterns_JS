# What is a Factory???

Remember the Single Responsibility Principle. We don't want a master class that can just do everything. So although Factory Methods are neat ways to approach certain issues, it _might_ be better to take factory methods and put them into their own classes.

#### It's literally just moving Factory Methods into a Factory class...

```js
// Point is a class outside of this scope... Look at Factory_Method for its implementation... but actually I brought it back in the example down in the other block: :)
class PointFactory {
    static newCartesianPoint(x, y) {
        return new Point(x, y);
    }

    static newPolarPoint(rho, theta) {
        return new Point(rho * Math.cos(theta), rho * Math.sin(theta));
    }
}

let p = PointFactory.newCartesianPoint(4, 5);

let p2 = PointFactory.newPolarPoint(5, Math.PI / 2);
```

You can implement this as either static methods or as member methods (i.e. you would need to instantiate a PointFactory -- this would be more in the case of storing data into a instance)

Another cool thing that we can do is expose the factory from _within_ the class that the factory is meant to create. Here is what I mean:

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static get factory() {
        return new PointFactory();
    }
}
```

Then we can do something like:

```js
let p2 = Point.factory.newPolarPoint(5, Math.PI / 2);
```
