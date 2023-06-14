# Bridge

Designed for connecting different components by abstractions. It prevents a "Cartesian prodcut complexity explosion"

Example:
Say we want to make a class called `ThreadScheduler`. This class can be preemptive or cooperative. AND it can run on Windows or Unix. We will now need to make:

-   WindowsPreemptiveThreadScheduler
-   WindowsCooperativeThreadScheduler
-   LinuxPreemptiveThreadScheduler
-   LinuxCooperativeThreadScheduler

If we need to consider other variables, you can see how this might get more and more complex

Bridge pattern avoids the entity explosion

## Example

Let's say we have the following

```js
class VectorRenderer {}
class RasterRenderer {}

class Shape {}
class Circle {}
class Square {}
```

Let's consider we want to draw these shapes in two formats raster and vector. We would need to consider a RasterCircle, RasterSquare, VectorCircle, VectorSquare, etc. This leads to state space explosion.

Instead we want to bridge the hierarchies (the categories)

Here the hierarchies are:

Shape: Square, Circle, Triangle, ...
Raster: Raster, Vector, ...

What we can do instead of making a SR, SV, CR, CV, etc...
is we can bridge the hierarchies. One way to do this is to make on of the hierarchies a member of the other. For example:

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }
}
```

From there on, we can render the different shapes. For now let's just take a look at circle:

```js
class VectorRenderer {
    renderCircle(radius) {
        console.log(`Drawing a circle of radius ${radius}`);
    }
}
class RasterRenderer {
    renderCircle(radius) {
        console.log(`Drawing a circle of radius ${radius}`);
    }
}
class Circle extends Shape {
    constructor(renderer, radius) {
        super(renderer);
        this.radius = radius;
    }

    draw() {
        this.renderer.renderCircle(this.radius);
    }

    resize(factor) {
        this.radius *= factor;
    }
}

let raster = new RasterRenderer();
let vector = new VectorRenderer();

let circle = new Circle(vector, 5);
circle.draw(); // vector draws circle radius 5
circle.resize(2);
circle.draw(); // vector draws circle radius 10
```

Notice we had to implement functions for circle. As we add more shapes, we would probably have to add methods for each of those shapes in VectorRenderer and RasterRenderer. This gets us away from having a bunch of classes, but not away from having a lot of methods :(

This got ugly quick. I'm going to drop a comment from Michel that made sense to me. It might be somethign to think about regarding Bridge pattern. Especially regarding the above example in particular.

> I'm not comfortable with the design of the above depicted bridge. First, It seems to me that the open-close principle is violated, and second, there are too many dependencies (amountOfRenderers\*amountOfShapes dependencies).

> Wouldn't it be better to outsource the Draw method to a class (say Drawer) which then requests directly to a Bridge/Mediator object that centralises dependencies between the hierarchies and combines the methods contained in each of the hierarchies (e.g. Circle characteristics + drawing characteristics of a vector --> Draw(Circle, Vector)?
