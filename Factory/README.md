# What the heck is the Factory Design Pattern?

## Why???

-   Object Creation Logic Becomes too convoluted
-   Initializer (constructor) is not descriptive
-   can turn into 'optional parameter hell'

## How is this different from Builder?

-   Factory is about wholesale object creation (non piecewise like Builder)

### There are two ways to implement Factory:

-   A separate method (Factory Method)
-   Separate Class (Factory)
-   Can create hierarchy of factories (Abstract Factory)
