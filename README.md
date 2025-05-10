# Software Design Patterns Examples

This repository contains examples of common software design patterns implemented in TypeScript. Each example includes:

- Anti-pattern implementation (how NOT to do it)
- Proper pattern implementation (the recommended approach)
- Unit tests for pattern validation
- Main script to demonstrate the pattern in action

## Available Patterns

- Creational Patterns
  - [Factory](src/patterns/creational/factory/README.md)
  - [Builder](src/patterns/creational/builder/README.md)
  - [Prototype](src/patterns/creational/prototype/README.md)
  - [Singleton](src/patterns/creational/singleton/README.md)

- Structural Patterns
  *(Coming soon)*

- Behavioral Patterns
  - [Observer](src/patterns/behavioral/observer/README.md)

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
│   │   └── main.ts
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