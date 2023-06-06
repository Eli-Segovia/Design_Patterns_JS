// Decorator Coding Exercise
// You are given two classes, Bird and Lizard, that both
// take the creature's age and allow the creature to
// fly/crawl (or not) depending on its age.

// Please create a decorator called Dragon that acts as
// both a bird and a lizard, i.e., it has an age value
// and can both fly() and crawl(), reusing the original
// classes' functionality.

class Bird {
    constructor(age = 0) {
        this.age = age;
    }

    fly() {
        return this.age < 10 ? 'flying' : 'too old';
    }
}

class Lizard {
    constructor(age = 0) {
        this.age = age;
    }

    crawl() {
        return this.age > 1 ? 'crawling' : 'too young';
    }
}

class Dragon {
    constructor(age = 0) {
        this.bird = new Bird(age);
        this.lizard = new Lizard(age);
    }

    // this setter is important!
    // if somebody changes the age, we NEED to change the
    // underlying data as well!!!
    set age(age) {
        this.bird.age = age;
        this.lizard.age = age;
    }

    get age() {
        return this.age;
    }

    fly() {
        return this.bird.fly();
    }

    crawl() {
        return this.lizard.crawl();
    }
}
let lizard = new Lizard(3);

console.log(lizard.crawl());
let dragon = new Dragon(10);

console.log(dragon.fly());
console.log(dragon.crawl());
