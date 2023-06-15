# Composite

Treat individual and aggregaate objects in uniform fashion.

For example in certain graphic design software or in Figma, you can group objects, and you can manipulate them as a group, or you could go in and manipulate a single object.

Composite looks to implement this sort of thing, where there is one interface that allows you to work with an object or group of objects in this sort of way.

Definition: A mechanism for treating individual (scalar) objects and compositions of objects (e.g. arrays) in a uniform manner.

## Geometric Shapes Example

Think of a drawing app. you can drag around and resize shapes. And you can also drag around and resize a whole group of shapes. Let's emulate this scenario

```js
// GraphicObject can act as a group or a standalone object
class GraphicObject {
    get name() {
        return this._name;
    }
    constructor(name = 'Group' + GraphicObject.count++) {
        this._name = name;
        this.color = undefined;
        this.children = [];
    }

    print(buffer, depth) {
        buffer.push('*'.repeat(depth));
        if (depth > 0) {
            buffer.push(' ');
        }

        buffer.push(this.name);
        buffer.push('\n');

        for (let child of this.children) {
            child.print(buffer, depth + 1);
        }
    }

    toString() {
        let buffer = [];
        this.print(buffer, 0);
        return buffer.join('');
    }
}
GraphicObject.count = 0;

class Circle extends GraphicObject {
    constructor(color) {
        super('Circle');
        this.color = color;
    }
}

class Square extends GraphicObject {
    constructor(color) {
        super('Square');
        this.color = color;
    }
}

let drawing = new GraphicObject();
drawing.children.push(new Square('Red'));
drawing.children.push(new Circle('Yellow'));

let group = new GraphicObject();
group.children.push(new Circle('Blue'));
group.children.push(new Square('Blue'));

// We can add this group as an element of `drawing`
drawing.children.push(group);
```

Here we've just added a group into a group. We can add groups and groups and groups to groups in an infinite manner.

The `Circle` and `Square` and `GraphicObject` get treated in a uniform manner. when we call `toString()` on a GraphicObject, it will print correctly

So again, the idea is that we can have an object which maskerades as a scaler element and a collection of elements. Whether it's by itself or is many more, you interact with that thing the same way.

## Neural Networks Example

We start out with a Neuron:

```js
class Neuron {
    constructor()
}
```

This Neuron can connect with other Neuron(s)

```js
class Neuron {
    constructor() {
        // connections from other neurons
        this.in = [];
        // connections to other neurons
        this.out = [];

        connectTo(otherNeuron) {
            this.out.push(otherNeuron);
            otherNeuron.in.push(this);
        }
    }

    toString() {
        return `A neuron with ${this.in.length} inputs and ${this.out.length} outputs.`
    }
}
```

Now let's say we have a `NeuronLayer` which is a collection of neurons that we should also be able to connect to and from other Neurons

```js
// essentially an array of neurons.
class NeuronLayer extends Array {
    constructor(count) {
        super();
        while (count-- > 0) {
            this.push(new Neuron());
        }
    }

    toString() {
        return `A layer with ${this.length} neurons`;
    }
}
```

Now let's play around a little with these structures:

```js
let neuron1 = new Neuron();
let neuron2 = new Neuron();

let layer1 = new NeuronLayer(3);
let layer2 = new NeuronLayer(4);
```

what if I want to connect `neuron1` to `layer1`? or connect `layer2` to `neuron2`? or `layer1` to `layer2`?

As it is, we can't really do something like:

```js
neuron1.connectTo(layer2);
layer2.connectTo(neuron1);
layer1.connectTo(layer2);
```

It breaks. But if we want to apply the Composite pattern, we want to do something like the above. We just want to use one `connectTo` method that just works. For that we are going to need to rethink things and get rid of how we've implemented `connectTo`

```js
class Connectable {
    connectTo(other) {
        for (let from of this){
            for (let to of other) {
                from.out.push(to);
                to.in.push(from);
            }
        }
    }
}

class Neuron extends Connectable{
    constructor() {
        super()
        // connections from other neurons
        this.in = [];
        // connections to other neurons
        this.out = [];

        connectTo(otherNeuron) {
            this.out.push(otherNeuron);
            otherNeuron.in.push(this);
        }
    }

    toString() {
        return `A neuron with ${this.in.length} inputs and ${this.out.length} outputs.`
    }
}
```

We run into a problem for NeuronLayer. There is no multiple inheritance in JS. So we sort of work around with using an aggregation which sets a base class and mixes in the props and field values of other provided classes. Not great, but a good shortcut. It is below the NeuronLayer Class

```js
// essentially an array of neurons.
class NeuronLayer extends aggregation(Array, Connectable) {
    constructor(count) {
        super();
        while (count-- > 0) {
            this.push(new Neuron());
        }
    }

    toString() {
        return `A layer with ${this.length} neurons`;
    }
}

//https:stackoverflow.com/questions/29879267/
var aggregation = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor(...args) {
            super(...args);
            mixins.forEach(mixin => {
                copyProps(this, new mixin());
            });
        }
    }
    let copyProps = (target, source) => {
        // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach(prop => {
                if (
                    !prop.match(
                        /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
                    )
                )
                    Object.defineProperty(
                        target,
                        prop,
                        Object.getOwnPropertyDescriptor(source, prop)
                    );
            });
    };
    mixins.forEach(mixin => {
        // outside constructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
};
```

We're getting close! But, notice that in `Connectable`, we or iterating `this`. That will work for NeuronLayer because it extends array. However, it will not currently work with Neuron. Neuron is not iterable at this moment. To make it iterable, we do the following

```js
class Neuron extends Connectable{
    constructor() {
        super()
        // connections from other neurons
        this.in = [];
        // connections to other neurons
        this.out = [];

        connectTo(otherNeuron) {
            this.out.push(otherNeuron);
            otherNeuron.in.push(this);
        }
    }

    toString() {
        return `A neuron with ${this.in.length} inputs and ${this.out.length} outputs.`
    }

    // this is used when someboedy tries to iterate
    // on this current object

    // we simply return this
    [Symbol.iterator]() {
        let returned = false;
        return {
            next: () => ({
                value: this,
                done: returned++
            })
        }
    }
}
```

Now we can do something like this :)

```js
neuron1.connectTo(layer2);
layer2.connectTo(neuron1);
layer1.connectTo(layer2);
```

So the takeaway is that we can connect and work with scalar objects or collection/group objects in a uniform manner. We make a generic way to interact with these structures. As we see in this example, a good way to do this is to mask scalar (single objects) as a collection of objects. Here we implemented the iterator to simply return `this` upon iteration.
