/*
 *   Dog.js
 *   Eli Segovia
 *
 *   This is just an example of using Builder pattern to build
 *   Dogs.
 *
 *   Dogs are
 */

class Dog {
    constructor() {
        this.name = this.breed = '';
        this.isFemale = true;
        this.age = -1;

        this.favoriteActivities = [];
    }

    toString() {
        return (
            `This doggy is named ${this.name} and is a ${this.breed}\n` +
            `${this.isFemale ? 'She' : 'He'} loves to:\n` +
            `${this.favoriteActivities.map((a) => `- ${a}`).join('\n')}`
        );
    }
}

class DogBuilder {
    constructor(dog = new Dog()) {
        this.dog = dog;
    }

    get is() {
        return new DogTypeBuilder(this.dog);
    }

    get loves() {
        return new DogActivityBuilder(this.dog);
    }

    build() {
        let builtDog = this.dog;
        this.dog = new Dog();
        return builtDog;
    }
}

class DogTypeBuilder extends DogBuilder {
    constructor(dog) {
        super(dog);
    }

    named(name) {
        this.dog.name = name;
        return this;
    }

    breedType(breed) {
        this.dog.breed = breed;
        return this;
    }

    aged(age) {
        this.dog.age = age;
        return this;
    }

    isMale() {
        this.dog.isFemale = false;
        return this;
    }

    isFemale() {
        this.dog.isFemale = true;
        return this;
    }
}

class DogActivityBuilder extends DogBuilder {
    constructor(dog) {
        super(dog);
    }

    to(activity) {
        this.dog.favoriteActivities.push(activity);
        return this;
    }
    and(activity) {
        this.to(activity);
        return this;
    }
    doing(activities) {
        activities.forEach((a) => this.dog.favoriteActivities.push(a));
        return this;
    }
}

let thisDog = new DogBuilder();

let dog = thisDog.is
    .aged(4)
    .breedType('German Shepherd')
    .named('Princess')
    .isFemale()
    .loves.to('Run')
    .and('Play Fetch')
    .and('Bark')
    .build();

console.log(dog.toString());
