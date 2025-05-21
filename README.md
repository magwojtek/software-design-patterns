# Software Design Patterns Examples

This repository contains examples of common software design patterns implemented in TypeScript. Each example includes:

- Anti-pattern implementation (how NOT to do it)
- Proper pattern implementation (the recommended approach)
- Unit tests for pattern validation
- Main script to demonstrate the pattern in action

## Available Patterns

- [Creational Patterns](src/patterns/creational/README.md)
  - [Factory](src/patterns/creational/factory/README.md)
  - [Builder](src/patterns/creational/builder/README.md)
  - [Prototype](src/patterns/creational/prototype/README.md)
  - [Singleton](src/patterns/creational/singleton/README.md)

- [Structural Patterns](src/patterns/structural/README.md)
  - [Adapter](src/patterns/structural/adapter/README.md)
  - [Bridge](src/patterns/structural/bridge/README.md)
  - [Composite](src/patterns/structural/composite/README.md)
  - [Decorator](src/patterns/structural/decorator/README.md)
  - [Facade](src/patterns/structural/facade/README.md)
  - [Flyweight](src/patterns/structural/flyweight/README.md)
  - [Proxy](src/patterns/structural/proxy/README.md)

- [Behavioral Patterns](src/patterns/behavioral/README.md)
  - [Observer](src/patterns/behavioral/observer/README.md)
  - [Strategy](src/patterns/behavioral/strategy/README.md)
  - [Iterator](src/patterns/behavioral/iterator/README.md)
  - [Command](src/patterns/behavioral/command/README.md)
  - [Template Method](src/patterns/behavioral/template-method/README.md)
  - [Chain of Responsibility](src/patterns/behavioral/chain-of-responsibility/README.md)
  - [State](src/patterns/behavioral/state/README.md)
  - [Mediator](src/patterns/behavioral/mediator/README.md)
  - [Visitor](src/patterns/behavioral/visitor/README.md)
  - [Memento](src/patterns/behavioral/memento/README.md)
  - [Interpreter](src/patterns/behavioral/interpreter/README.md)

## Project Structure

Patterns are organized by their categories with the following structure:

```
src/
├── creational/
│   ├── singleton/
│   │   ├── anti-pattern/
│   │   │   ├── implementation.ts
│   │   │   └── implementation.test.ts
│   │   ├── proper-pattern/
│   │   │   ├── implementation.ts
│   │   │   └── implementation.test.ts
│   │   ├── main.ts
│   │   ├── README.md
│   └── factory/
│       ├── ...
├── structural/
│   └── ...
└── behavioral/
    ├── observer/
    │   ├── ...
    └── ...
```

## Running the Examples

To run an individual pattern example:

```bash
yarn start:pattern pattern-name
```

Examples:
```bash
yarn start:pattern singleton
yarn start:pattern factory
yarn start:pattern observer
```

To run all tests:

```bash
yarn test
```

## Development

- `yarn build` - Build the TypeScript project
- `yarn lint` - Run ESLint
- `yarn format` - Format the code with Prettier
