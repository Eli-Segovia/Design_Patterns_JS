# Open-Closed Principle

Open close principle says that objects are open for extension, but closed for modification.

### What is modification?

Modification is adding code into a class that is perhaps already tested, already deployed, or already good to go. Making changes to it is not very great...

### What is extension?

Extension usually means inheritance. A class inherits features from another class and adds upon that functionality in its own definition.

### Example

Say we define products as a class:

```js
// This is a way you can do enums in JavaScript.
// Basically you create an immutable object with
// Unchangeable fields
let Color = Object.freeze({
    red: 'red',
    green: 'green',
    blue: 'blue'
});

let Size = Object.freeze({
    small: 'small',
    medium: 'medium',
    large: 'large',
    yuge: 'yuge'
});

class Product {
    constructor(name, color, size) {
        this.name = name;
        this.color = color;
        this.size = size;
    }
}
```

Here we have a basic definition of what a product is. But let's say we want to filter through these objects... Remember that the Single-Responsibilty principle tells us that a class should only have one responsibility. Therefore, we should create another class:

```js
class ProductFilter {
    filterByColor(products, color) {
        return products.filter((p) => p.color === color);
    }

    filterBySize(products, size) {
        return products.filter((p) => p.size === size);
    }

    filterBySizeAndColor(products, size, color) {
        return products.filter((p) => p.size === size && p.color === color);
    }

    // state space explosion
    // 3 criteria (+weight) = 7 methods

    // OCP = open for extension, closed for modification
}
```

Notice the last few comments here. For the moment, we only have 3 states that we need to worry about. But we have to make a method for each, and each paired with another, and then all of them. That's a total of 7. If we were to add another state, that would make 25 methods (I think), and we would have to modfiy the class in order to add those methods. This is breaking OCP because we would be modifying :(

Instead, we should decouple the criteria, and make them independent by using _Specifications_.

Specifications are a type of class that defines a certain type of criteria. In this example it's filtering criteria to filter through the products.

For example, in order to filter by color:

```js
class ColorSpecification {
    constructor(color) {
        this.color = color;
    }

    isSatisfied(product) {
        return product.color === this.color;
    }
}
```

Notice here we must have the constructor to define the certain criteria, and then we have another method here that we use to check/verify the specification has been met.

The following is the rest of the code taken from the course:

```js
class ColorSpecification {
    constructor(color) {
        this.color = color;
    }

    isSatisfied(item) {
        return item.color === this.color;
    }
}

class SizeSpecification {
    constructor(size) {
        this.size = size;
    }

    isSatisfied(item) {
        return item.size === this.size;
    }
}

class BetterFilter {
    filter(items, spec) {
        return items.filter((x) => spec.isSatisfied(x));
    }
}

// specification combinator
class AndSpecification {
    constructor(...specs) {
        this.specs = specs;
    }

    isSatisfied(item) {
        return this.specs.every((x) => x.isSatisfied(item));
    }
}

let bf = new BetterFilter();
console.log(`Green products (new):`);
for (let p of bf.filter(products, new ColorSpecification(Color.green))) {
    console.log(` * ${p.name} is green`);
}

console.log(`Large products:`);
for (let p of bf.filter(products, new SizeSpecification(Size.large))) {
    console.log(` * ${p.name} is large`);
}

console.log(`Large and green products:`);
let spec = new AndSpecification(
    new ColorSpecification(Color.green),
    new SizeSpecification(Size.large)
);
for (let p of bf.filter(products, spec))
    console.log(` * ${p.name} is large and green`);
```
