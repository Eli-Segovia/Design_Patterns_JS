# Prototype

## Motivation

Complicated stuff designed from scratch; meaning that you can't just draw a laptop and then BOOM, you have a laptop.

Instead, you reiterated existing designs, and you make a copy or improve that design somehow.

An existing (partially or fully constructed) design is a Prototype

We make a copy of the Prototype (cloning the prototype) and then we customize it to add stuff to it.

-   This required 'deep copy' support

We make the cloning process convenient (e.g., via Factory)

### Deep Copying and Stuff

```js
class Address {
    constructor(streetAddress, city, country) {
        this.streetAddress = streetAddress;
        this.city = city;
        this.country = country;
    }

    toString() {
        return `Address: ${this.streetAddress}, ${this.city}, ${this.country}`;
    }
}

class Person {
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }

    toString() {
        return `${this.name} lives at ${this.address}`;
    }
}

// Make a person in the U.K.
let john = new Person('John', new Address('123 London Rd', 'London', 'UK'));
```

Now let's say that we want to make _another_ person that lives in London, but a different street than John. We _could_ just make another person like we did John, but that's repetition.

We might take the naive approach (which is wrong) and do something like:

```js
let jane = john;
jane.name = 'Jane';
jane.address.streetAddress = '321 Angel St';
```

However, if we then print the out:

```js
console.log(john);
console.log(jane);
```

We get:

```
Jane lives at Address: 321 Angel st, London, UK
Jane lives at Address: 321 Angel st, London, UK
```

`jane` and `john` now refer to the same memory.

We don't want that, so one way we can do that is to implement our own deepcopy function:

```js
class Address {
    constructor(streetAddress, city, country) {
        this.streetAddress = streetAddress;
        this.city = city;
        this.country = country;
    }

    deepCopy() {
        return new Address(
        this.streetAddress = streetAddress;
        this.city = city;
        this.country = country;
        )
    }

    toString() {
        return `Address: ${this.streetAddress}, ${this.city}, ${this.country}`;
    }
}

class Person {
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }

    deepCopy() {
        return new Person(
            this.name,
            this.address.deepCopy()
        )
    }

    toString() {
        return `${this.name} lives at ${this.address}`;
    }
}

let john = new Person('John', new Address('123 London Rd', 'London', 'UK'));
let jane = john.deepCopy();
jane.name = 'Jane';
jane.address.streetAddress = '321 Angel St';
// now jane and john are different :)
```

So what we've made here is basically a Prototype, where `john` serves as the prototype

### Copy Through Serialization

Making our own deep copy functions can become annoying. Instead we can serialize the data of an object into a format that we can parse and then just copy that data into the child objects we later create. (Obviously Json is a popular way)

We need to build a custom serializer because simply stringifying to json only works to keep a dictionary of key/value pairs: it does not preserve method functionality or more complex objects

```js
class Serializer {
    constructor(types) {
        this.types = types;
    }

    markRecursive(object) {
        // finds the index of the object passed in this function within the
        // this.types array by matching class name
        let idx = this.types.findIndex(t => {
            return t.name === object.constructor.name;
        });

        // if index is found
        if (idx !== -1) {
            // set the idx of the type in the serialized object
            object['typeIndex'] = idx;

            for (let key in object) {
                // this is to exclude inherited keys that javascript
                // automatically puts in objects (like "hasOwnProperty" itself)
                if (object.hasOwnProperty(key)) {
                    // if the key is a type, then we need to mark it as such
                    this.markRecursive(object[key]);
                }
            }
        }
    }

    reconstructRecursive(object) {
        // if it has a typeIndex, we need to a little more work to
        // preserve the methods and extra details :) otherwise,
        // it's a simple object with k/v pairs, and we can just return it
        // as is
        if (object.hasOwnProperty('typeIndex')) {
            let type = this.types[object.typeIndex];
            let obj = new type(); // use default constructor
            // need to go through keys to set the properties
            for (let key in object) {
                if (object.hasOwnProperty(key) && object[key] != null) {
                    // we use reconstructRecursive to rebuild a custom
                    // type if it is indeed a custom type
                    obj[key] = this.reconstructRecursive(object[key]);
                }
            }
            // remove type index, as that's only needed in serialized form
            delete obj.typeIndex;
            return obj;
        }
        return object;
    }

    clone(object) {
        // set custom types and stuff meta so that we can discern what is a
        // custom type
        this.markRecursive(object);
        let copy = JSON.parse(JSON.strigify(object));
        return this.reconstructRecursive(copy);
    }
}
```

#### Using the Serializer

```js
let john = new Person('John', '123 London Rd', 'UK');

let s = new Serializer([Person, Address]);
let jane = s.clone(john);

jane.name = 'Jane';
jane.address.streetAddress = '321 Angel St';
```
