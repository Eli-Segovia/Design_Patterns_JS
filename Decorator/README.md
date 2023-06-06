# Decorator

# Decorator

Adding behavior without altering the class itself.

## Motivation:

Sometimes you have a class, but you want to augment the class and add extra features.

You can rewrite the existing class, but that breaks the Open Close Principle. Once you have written and tested the code, don' change it!!!

You wat to keep new functionality separate (Single Responsibility)

Need to be able to interact with existing structures

Two options:

-   Just use inheritance (if possible)
-   Build a decorater, which simply references the decorated objects

Say we have the following:

```js
class Shape {}

class Circle extends Shape {
    constructor(radius = 0) {
        super();
        this.radius = radius;
    }

    resize(factor) {
        this.radius *= factor;
    }

    toString() {
        return a`A circle of radius ${this.radius}`;
    }
}
```

Lets suppose we're now working with these `Circle` and `Shape` classes, but now we want to add color to the `Shape` class. We _could_ go back into the `Shape` class and add the color attribute and make a new constructor. But if this code were way more complicated and was in production, this would be a horrible option.

Decorator time :)

A decorator is just a class that wraps around another class and adds information/attributes to it.

```js
class ColoredShape extends Shape {
    constructor(shape, color) {
        super();
        this.shape = shape;
        this.color = color;
    }

    toString() {
        return `${this.shape.toString()} has the color ${this.color}`;
    }
}

let circle = new Circle(2);
console.log(circle.toString());
// output: "Circle of radius 2"

let redCircle = new ColoredShape(circle, 'red');

console.log(redCircle.toString);
// output "Circle of radius 2 has the color red"
```

We can continue to wrap decorators such that they build on top of each other... For example, let's add another decorator for the shape class and add it to the same red circle above (this is why the decorators extend the base class):

```js
class TransparentShape extends Shape {
    constructor(shape, color) {
        super();
        this.shape = shape;
        this.color = color;
    }

    toString() {
        return `${this.shape.toString()} has ${
            this.transparency * 100.0
        }% transparency`;
    }
}
```

A downside of decorators is that we lose access to some of the underlying methods/values. For example, the `Circle` class has the `Circle.resize()` method. However, we cannot use that method from the `ColoredShape` class directly. However, we hold a reference to the underlying circle, so we can still call the method by doing `ColoredShape.shape.resize()`.
