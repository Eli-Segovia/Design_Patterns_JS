# What Are Abstract Factories? :(

So there won't be any code here. You can look at `codeAlong.js` to look at some example code.

Essentially what an Abstract Factory is a an abstract class from which sub classes will inherit to create objects. Abstract Factory is just the concept of Factory hierarchies that map to the objects that they create. If that doesn't make sense, think of the following (which you can find coded in the `codeAlong.js` code)

There is an abstract class `HotDrink` it maps to a factory `HotDrinkMachine` (where `HotDrinkMachine` is the factory)

However these are abstract, so they are not implemented...

However, `Coffee` and `HotTea` inherit `HotDrink`, and therefore will need to be made by `CoffeeMachine` and `TeaMachine` which both inherit from `HotDrinkMachine`. So here we see this hierarchy of abstract classes and abstract Factories and how they map to each other. That is the jist of Abstract Factory :)
