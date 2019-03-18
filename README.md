# CoffeeBird

A DSL that compiles to RBLang.

**This language is currently a work in progress. [See todo](#todo).**

RBLang is Rainbird's XML based language which is used to define concepts, relationships, and rules to solve complex decision making problems. CoffeeBird replicates all of the features ([note](#todo)) of RBLang without the visual noise of XML.

## Syntax

Full syntax documentation can be found [here](syntax.md).

```
concept Person (type = string)
concept Country (type = string)
concept Language (type = string)

rel Person - speaks - Language
rel Person - lives in - Country
rel Country - national language - Language

Language("English")
Language("French")
Language("German")
Country("England")
Country("France")

"England" - national language - "English" (cf = 100)
"France" - national language - "French"

speaks (cf = 75, minimumRuleCertainty = 60) {
  %S - lives in - %COUNTRY;
  %COUNTRY - national language - %O
}
```

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

## Todo

* Question wording for relationships
* Condition-expressions
* Condition-values
* Built-in functions `countRelationshipInstances`, `now()` etc.
* Preserve whitespace between entities
* Preserve comments
* Improve and document API
* Expand tests
