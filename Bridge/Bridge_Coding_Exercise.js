/**
 * 
Bridge Coding Exercise

 * You are given an example of an inheritance hierarchy which results in
 * Cartesian-product duplication.

Please refactor this hierarchy, giving the base class Shape
a constructor that takes a renderer, whose expected interface is:

class <SomeRenderer>
{
  get whatToRenderAs()
  {
    // todo
  }
}

There's no need to implement the type above (due to duck typing),
but I do want you to implement classes VectorRenderer  and RasterRenderer.
Each inheritor of the Shape  class should have a constructor that takes a Renderer 
such that, subsequently, each constructed object's toString()  operates correctly,
for example,

new Triangle(new RasterRenderer()) # returns "Drawing Triangle as pixels"
 */
// ORIGINAL IMPLEMENTATION THAT WE WANT TO REFACTOR
// class Shape {
//     constructor(name) {
//         this.name = name;
//     }
// }

// class Triangle extends Shape {
//     constructor() {
//         super('triangle');
//     }
// }

// class Square extends Shape {
//     constructor() {
//         super('square');
//     }
// }

// WHAT WE WE TO AVOID:
// class VectorSquare extends Square
// {
//   toString()
//   {
//     return `Drawing square as lines`;
//   }
// }
//
// class RasterSquare extends Square
// {
//   toString()
//   {
//     return `Drawing square as pixels`;
//   }
// }
// imagine VectorTriangle and RasterTriangle are here too

class Shape {
    constructor(renderer, name) {
        this.renderer = renderer;
        this.name = name;
    }

    toString() {
        return `Drawing ${this.name} as ${this.renderer.whatToRenderAs}`;
    }
}

class Triangle extends Shape {
    constructor(renderer) {
        super(renderer, 'triangle');
    }
}

class Square extends Shape {
    constructor(renderer) {
        super(renderer, 'square');
    }
}

class VectorRenderer {
    get whatToRenderAs() {
        return 'lines';
    }
}

class RasterRenderer {
    get whatToRenderAs() {
        return 'pixels';
    }
}

console.log(new Square(new VectorRenderer()).toString());
