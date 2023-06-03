/**
 *
 * Factory Coding Exercise
 * You are given a class called Person . The person has two fields: id , and name .
 *
 * Please implement a  PersonFactory that has a non-static  createPerson()  method that takes a person's name and returns a person initialized with this name and an id.
 *
 * The id of the person should be set as a 0-based index of the object any instance of PersonFactory has created. So, the first person any factory makes should have Id=0, second Id=1 and so on.
 */

class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class PersonFactory {
    constructor() {
        this.id = 0;
    }
    createPerson(name) {
        return new Person(this.id++, name);
    }
}

let personFactory = new PersonFactory();

let person1 = personFactory.createPerson('Eli');

let person2 = personFactory.createPerson('John');

console.log(person1);

console.log(person2);
