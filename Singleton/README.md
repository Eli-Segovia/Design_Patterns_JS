# Singleton

A lot of people hate this one apparently. Let's see if that hate is warranted.

The authors of the original Gang of 4 design patterns actually decided to drop Singleton from their design patterns. Said there was always a "Design Smell"

Design Smell = not good

## Motivation

For some components it only makes sens to have one in the system, e.g.

-   Database Repository - only need to put database in memory once
-   Object factories - if we make a factory that makes objects based on a prototype, it doesn't make sense to make several prototypes. Only one is needed. Making more prototypes does not make sense. **Just like eating Cava does not make sense**. The constructor call is expensive, so if we can avoid it, that would be pretty cool :)
-   Initialization should only happen once. Singleton is about providing with one instance instead of making several instances.
-   Want to prevent anyone from creating additional copies.

## Implementation and Stuff

With a singleton, we want the constructor to return the same instance all the time. We have to think about the implementation of the constructor when we do this, we can't just do a `this.x = x` for all the arguments in the constructor.

```js
class Singleton {
    constructor() {
        const instance = this.constructor.instance;
        if (instance) {
            return instance;
        }

        this.constructor.instance = this;
    }
}

let s1 = new Singleton();
let s2 = new Singleton();

s1 === s2; // true ==> it is the same exact instance in memory
```

This is kind of Inception-esque. We are basically storing an instance of the Singleton itself in the constructor of the Singleton. First we grab the instance from the constructor's scope. If it didn't exist at the point of calling it, then we simply define it to this itself.

### Monostate

Another way of implementing Singleton.

```js
class ChiefExecutiveOfficer {
    get age() {
        return ChiefExecutiveOfficer._age;
    }
    get name() {
        return ChiefExecutiveOfficer._name;
    }

    set age(value) {
        ChiefExecutiveOfficer._age = value;
    }
    set name(value) {
        ChiefExecutiveOfficer._name = value;
    }

    toString() {
        return `CEO's name is ${this.name} and he is ${this.age} years old`;
    }
}

// static variables Set these vars in the class itself
ChiefExecutiveOfficer._age = undefined;
ChiefExecutiveOfficer._name = undefined;

let ceo = new ChiefExecutiveOfficer();
ceo.name = 'Adam Smith';
ceo.age = 55;

let ceo2 = new ChiefExecutiveOfficer();
ceo2.name = 'John Gold';
ceo2.age = 25;

// This prints the same exact thing ('John Gold')
console.log(ceo.toString());
console.log(ceo2.toString());
```

### Singleton Problems

Basically, it makes testing pretty difficult. The code is in `singleton_problems.js`. Essentially, the issue is that using a Singleton in a unit (or a class) makes testing that Unit (or class) depend on the Singleton. We would be testing the Singleton as well, so if the Singleton represents a database, it makes it hard for us to swap out that database with some dummy data.

Unit testing = testing on code units (usually classes)
Integration testing = testing how those units work together

We make a simple fix to the issue by making a `ConfigurableRecordFinder` in the example code so that we can configure whether we are using a Singleton database or a dummy database
