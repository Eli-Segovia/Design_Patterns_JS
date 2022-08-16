# Dependency Inversion Principle

What is it?
Basically that a high-level module should not depend on a specific class.

For example, if we need to perform some operation on some data, we should not care about the low level module (the data structure), we should be able to take the data and perform the operation on the higher level module regardless of the data structure implementation of the lower level module.

Here is example code

```js
let Relationship = Object.freeze({
    parent: 0,
    child: 1,
    sibling: 2
});

class Person {
    constructor(name) {
        this.name = name;
    }
}

// LOW-LEVEL (STORAGE)

class RelationshipBrowser {
    constructor() {
        if (this.constructor.name === 'RelationshipBrowser')
            throw new Error('RelationshipBrowser is abstract!');
    }

    findAllChildrenOf(name) {}
}

class Relationships extends RelationshipBrowser {
    constructor() {
        super();
        this.data = [];
    }

    addParentAndChild(parent, child) {
        this.data.push({
            from: parent,
            type: Relationship.parent,
            to: child
        });
        this.data.push({
            from: child,
            type: Relationship.child,
            to: parent
        });
    }

    findAllChildrenOf(name) {
        return this.data
            .filter(
                (r) => r.from.name === name && r.type === Relationship.parent
            )
            .map((r) => r.to);
    }
}

// HIGH-LEVEL (RESEARCH)

class Research {
    // constructor(relationships)
    // {
    //   // problem: direct dependence ↓↓↓↓ on storage mechanic
    //   let relations = relationships.data;
    //   for (let rel of relations.filter(r =>
    //     r.from.name === 'John' &&
    //     r.type === Relationship.parent
    //   ))
    //   {
    //     console.log(`John has a child named ${rel.to.name}`);
    //   }
    // }

    constructor(browser) {
        for (let p of browser.findAllChildrenOf('John')) {
            console.log(`John has a child named ${p.name}`);
        }
    }
}

let parent = new Person('John');
let child1 = new Person('Chris');
let child2 = new Person('Matt');

// low-level module
let rels = new Relationships();
rels.addParentAndChild(parent, child1);
rels.addParentAndChild(parent, child2);

new Research(rels);
```

In order to perform the dependency inversion in this case, what we do is we create the `RelationshipBrowser`. This serves as a sort of inerface where the `Relationship` class can implement the methods we need to perform. For example, here we want to filter the children of a certain parent... The interface itself does not care about what type of data structure we are using in the `Relationship` class, but when we implement the method in the `Relationship` class, since we are inside the class, we do care about the data structure used... However, when we use the `RelationshipBrowser` when we perform our high-level task (in this case research), we just use the Browser, and we don't care about the data structure used to hold the data. 
