# Interface Segregation Principle

Remember that interfaces are practically abstract classes where all the methods are not implemented. These are useful when you want to inherit some methods into a class that extends the interface. Although JavaScript does exactly support interfaces (it might in the future), at the moment it can be sort of emulated. Example:

```js
class Document {
    // this is a document that we can perform actions on with the following classes
}

class Machine {
    // this is a way to emulate interfaces
    constructor() {
        if (this.constructor.name === 'Machine')
            throw new Error('Machine is abstract!');
    }

    print(doc) {}
    fax(doc) {}
    scan(doc) {}
}

class MultiFunctionPrinter extends Machine {
    // this is a printer that extends the machine and defines the interface's functions
    print(doc) {
        //
    }

    fax(doc) {
        //
    }

    scan(doc) {
        //
    }
}

class NotImplementedError extends Error {
    // a custom error that we can throw if we do not implement a method. a possible solution to use interfaces, but not the best...
    constructor(name) {
        let msg = `${name} is not implemented!`;
        super(msg);
        // maintain proper stack trace
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, NotImplementedError);
        // your custom stuff here :)
    }
}

class OldFashionedPrinter extends Machine {
    // an example of a class that extends the Machine interface... not all methods are defined... we see two examples
    // of how to handle that: with the fax method, we simply do nothing, with the scan method, we throw a custom error
    // none of these solutions are ideal. (Though I personally like the custom error)
    // in fact the "do nothing" approach breaks the principle of least surprise: which means that we need to have
    // predictable behavior in how the methods work. Simply doing nothing is not a predictable behavior
    print(doc) {
        // ok
    }

    // omitting this is the same as no-op impl

    // fax(doc) {
    //   // do nothing
    // }

    scan(doc) {
        // throw new Error('not implemented!');
        throw new NotImplementedError('OldFashionedPrinter.scan');
    }
}
```

What ISP tells us, is that we should split up interfaces such that when we extend them, we are not inheriting things that we don't need. For example, the oldPrinter is not going to have the scanner or the faxing capabilities, and therefore it is not efficient to even inherit those.

So the above is not good in that we are inheriting things that we don't really need.

So what do we do?

```js
// solution
class Printer {
    constructor() {
        if (this.constructor.name === 'Printer')
            throw new Error('Printer is abstract!');
    }

    print() {}
}

class Scanner {
    constructor() {
        if (this.constructor.name === 'Scanner')
            throw new Error('Scanner is abstract!');
    }

    scan() {}
}
```

We can simply seperate each action/method into each of their own interfaces.

With this comes a caveat: in JavaScript, there is only single inheritance. So if we want to inherit more than one interface, we _can_ work with mixins and aggregation of the methods we need, but it's not exactly the best approach either. I show that below:

```js
var aggregation = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor(...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this, new mixin());
            });
        }
    }
    let copyProps = (target, source) => {
        // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
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
    mixins.forEach((mixin) => {
        // outside constructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
};

class Photocopier extends aggregation(Printer, Scanner) {
    print() {
        // IDE won't help you here
    }

    scan() {
        //
    }
}
```

This principle is maybe not the most applicable to JavaScript...
