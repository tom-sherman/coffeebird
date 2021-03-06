# Coffeebird

[![Build Status](https://travis-ci.org/tom-sherman/coffeebird.svg?branch=master)](https://travis-ci.org/tom-sherman/coffeebird)

A DSL that compiles to RBLang.

RBLang is Rainbird's XML based language which is used to define concepts, relationships, and rules to solve complex decision making problems. Coffeebird replicates all of the features of RBLang without the visual noise of XML.

## Syntax

Full syntax documentation can be found [here](syntax.md).

```
concept Person (type: string)
concept Country (type: string)
concept Language (type: string)

rel Person - speaks - Language
rel Person - lives in - Country
rel Country - national language - Language

Language("English")
Language("French")
Language("German")
Country("England")
Country("France")

"England" - national language - "English" (cf: 100)
"France" - national language - "French"

// This is a comment
speaks (cf: 75, minimumRuleCertainty: 60) {
  %S - lives in - %COUNTRY;
  %COUNTRY - national language - %O;
}
```

## CLI

You can install `coffeebird` globally to invoke the transpiler from the command line.

### Install it globally from NPM

```
npm i coffeebird -g
```

### Usage

```
coffeebird [input]

transpile a file to RBLang

Commands:
  coffeebird transpile [input]  transpile a file to RBLang             [default]

Positionals:
  input  The file to transpile.

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --output, -o
```

## API

You can use Coffeebird programmatically by installing it via NPM and requiring it.

```
npm i coffeebird
```

The Coffeebird module exports two functions `parse`, and `transpile`.

```javascript
const { parse, transpile } = require('coffeebird')
```

### `transpile(input)`

Take an `input` string and output the transpiled RBLang.

### `parse(input)`

Take an `input` Coffeebird string and outputs an AST.

## Development

Ensure you have Node and `npm` installed.

```
# Clone the repository
git clone https://github.com/tom-sherman/coffeebird

# Move into the cloned directory
cd coffeebird

# Install dependencies
npm i

# Run tests
npm t
```
