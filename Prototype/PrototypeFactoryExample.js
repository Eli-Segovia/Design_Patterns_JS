class Address {
    constructor(suite, streetAddress, city) {
        this.suite = suite;
        this.streetAddress = streetAddress;
        this.city = city;
    }

    toString() {
        return `Address: ${this.suite}, ${this.streetAddress}, ${this.city}`;
    }
}

class Employee {
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }

    toString() {
        return `${this.name} lives at ${this.address}`;
    }
}

class Serializer {
    constructor(types) {
        this.types = types;
    }

    markRecursive(object) {
        console.log(object);
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
                if (object.hasOwnProperty(key) && object[key] != null) {
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
        let copy = JSON.parse(JSON.stringify(object));
        return this.reconstructRecursive(copy);
    }
}

class EmployeeFactory {
    static _newEmployee(proto, name, suite) {
        // clone the prototype into a new object
        let copy = EmployeeFactory.serializer.clone(proto);
        copy.name = name;
        copy.address.suite = suite;
        return copy;
    }

    static newMainOfficeEmployee(name, suite) {
        return this._newEmployee(EmployeeFactory.main, name, suite);
    }

    static newAuxOfficeEmployee(name, suite) {
        return this._newEmployee(EmployeeFactory.aux, name, suite);
    }
}

EmployeeFactory.serializer = new Serializer([Employee, Address]);

// Here are two prototypes 'main' and 'aux'
// the fields that are null are the fields that we will fill in
// for the objects we construct. This time the factory will
// help the process of building look cleaner than the example in the
// README where we explicitly declare each field with dot notation.
EmployeeFactory.main = new Employee(
    null,
    new Address(null, '123 East Drive', 'London')
);
EmployeeFactory.aux = new Employee(
    null,
    new Address(null, '200 London Rd', 'Oxford')
);

let john = EmployeeFactory.newMainOfficeEmployee('John', 4321);
let jane = EmployeeFactory.newAuxOfficeEmployee('Jane', 222);

// console.log(john);
// console.log(jane);
