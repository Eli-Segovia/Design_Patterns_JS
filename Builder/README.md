# What is the Builder Design Patter?

## When construction gets a bit too complicated.

### Motivation:

Some Objects are simple and can be created in a single initializer call. However, other objects require a lot of stuff (like a lot of arguments in the constructor) and at that point it is kinda a hassle to create stuff...


Instead, we can opt for piecewise construction. Instead of calling a massive initializaer.

Essentially a Builder provides an API for constructing an object step-by-step.

When piecwise object construction is complicated a builder provides an API to do it succintly