# CoffeeBird

A DSL that compiles to RBLang.

**This language is currently a work in progress. [See todo](#todo).**

RBLang is Rainbird's XML based language which is used to define concepts, relationships, and rules to solve complex decision making problems. CoffeeBird replicates all of the features ([note](#todo)) of RBLang without the visual noise of XML.

## Types

|Type|Literal example|Notes|
|---|---|---|
|`String`|`"foo"`||
|`Number`|`3.45`||
|`Integer`|`3`|Some dictionary keys require integer values.|
|`Boolean`|`true`||
|`Enum`|`secondFormObject`|Many dictionary values are specified using the `enum` type.|

## Dictionaries

Dictionaries are denoted using parenthesis containing a comma delimited list of key-value-pairs.

They are used to specify options for concepts, relationships, facts, and rules. They are strongly typed and all key-value-pairs are optional, as is the dictionary itself. Where applicable, the default values are specified below.

**Examples:**

```
(askable = none)
```
A dictionary with an enum type as the value, set to `none`.

```
(weight = 100, behaviour = optional, alt = "This is some alt text.")
```

A dictionary containing multiple pairs.

## Comments

Comments are denoted with a preceding `//` and be placed at the end of a line or on a line of their own.

**Examples:**

```
// This is a comment
concept Person // Another comment
```

## Concepts

`concept [name] ([...concept dictionary])`

Creates a concept with a default type of `string`.

**Concept dictionary**

| Key | Values | Default |
| --- | --- | --- |
| `type` | `string`\|`number`\|`date`\|`truth` | `string`|
| `behaviour` | `mutuallyExclusive` | n/a |

**Examples:**

```
concept Person
concept Age (type = number)
concept Time of Day (behaviour = mutuallyExclusive)
```

## Relationships

`rel [subject name] - [relationship name] - [object name] ([...relationship dictionary])`

Create a relationship with a subject and object concept.

`[relationship name]` can include only lowercase characters a-z and spaces.

**Relationship dictionary**

| Key | Values | Default |
| --- | --- | --- |
| `plural` | Boolean | `true` |
| `allowUnknown` | Boolean | `false` |
| `askable` | `all`\|`none`\|`secondFormObject`\|`secondFormSubject` | `all` |
| `allowCf` | Boolean | `true` |
| `canAdd` | `all`\|`none`\|`object`\|`subject` | `all` |

**Examples:**

```
rel Country - has national language - Language
rel Person - speaks - Language (plural = true, askable = secondFormObject)
rel Person - lives in - Country (allowCf = false)
```

## Instances

`[concept name]("[instance]")`

Create a concept instance where `instance` is a string literal.

**Examples:**

```
Person("Dave")
Language("English")
```

## Facts

`"[subject]" - [relationship name] - "[object]" ([...fact dictionary])`

Create a fact between a subject and an object instance.

**Fact dictionary**

| Key | Values | Default |
| --- | --- | --- |
| `cf` | Integer | `100` |

**Examples:**

```
"England" - has national language - "English"
"Dave" - speaks - "English" (cf = 68)
```

## Variables

Variables are denoted by a preceding `%` and are written in UPPER_SNAKE_CASE. They are used inside of conditions.

**Examples:**

```
%FOO
%FOO_BAR
```

## Conditions

Conditions make up the body of rules. You can specify multiple conditions separated by a semicolon. A dictionary of options can also be specified.

Conditions come in three forms: condition-relationships, condition-expressions, and condition values.

**Condition Dictionary**

| Key | Values | Default |
| --- | --- | --- |
| `weight` | Integer | `100` |
| `behaviour` | `mandatory`\|`optional` |`mandatory`|
| `alt` | String | n/a |

### Condition-relationship

`[subject] - [relationship name] - [object] ([...condition dictionary]);`

Condition-relationships look similar to facts, but as well as having instances as subject and objects, they can also have variables.

**Examples:**

```
%S - speaks - %O;
%S - lives in - "England";
%PERSON - is aged - 25;
%O - is active - true;
```

### Condition-expression

*NB: Currently not supported.*

Condition-expressions are statements which can use a mixture of numbers, strings, operators, and variables. These work the same as in any C-like language.

Expressions follow the order of operations and support parenthesis.

| Operator | Meaning | 
| --- | --- | 
| `==` | Equal-to eg. `%FOO == %BAR` |
| `!=` | Not-equal-to eg. `%FOO != %BAR` |
| `+` | Addition eg. `4 + 2 == 6`, string concatenation eg. `"Hello, " + %NAME` |
| `-` | Subtraction eg. `3 - 6 == 3`, negation eg. `-5` |
| `*` | Multiplication eg. `2 * 4 == 8` |
| `/` | Division eg. `6 / 3 == 2` |
| `^` | Exponentiate eg. `2^4 == 2 * 2 * 2 * 2` |
| `>`, `>=`, `<`, `<=` | Number comparison `3 < 6 == true` |
| `!` | Boolean not eg. `!true == false` |
| `&&` | Boolean and eg. `true && false == false` |
| `\|\|` | Boolean or eg. `true || false == true` |

### Condition-value

*NB: Currently not supported.*

Condition-values are variable assignments. On the left of the `=` there is a variable, and on the right is an expression.

**Examples:**

```
%FOO = 9;
%BAR = true;
%BAZ = %BAR;
%BOO = %BAZ && %FOO < (2 + 3) * 2;
%STR = "a string";
```

## Rules

`"[subject]" - [relationship name] - "[object]" ([...rule dictionary]) { [...conditions] }`

Create a rule on a relationship using one or more conditions.

Both the subject and the object are optional, you are able to specify either, both, or neither when writing a rule.

**Rule dictionary**

| Key | Values | Default |
| --- | --- | --- |
| `cf` | Integer | `100` |
| `alt` | String | n/a |
| `minimumRuleCertainty` | Integer | `20` |

**Examples:**

```
speaks {
  %S - lives in %COUNTRY;
  %COUNTRY - has national language - %O;
}

eligible for - "Senior bus pass" (cf = 50) {
  %S - has age - %AGE;
  %AGE > 65;
}
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
