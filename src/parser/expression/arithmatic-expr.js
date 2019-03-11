const P = require('parsimmon')
const {
  BinaryLeft,
  BinaryRight,
  Postfix,
  Prefix,
  Operators,
  TableParser
} = require('./util')
const { _, Num, Str, Bool } = require('../shared')

// A basic value is any parenthesized expression or a literal.
const Basic = P.lazy(() =>
  P.string('(')
    .then(ArithmaticExpr)
    .skip(P.string(')'))
    .or(P.alt(Num, Str, Bool))
)

// Now we can describe the operators in order by precedence. You just need to
// re-order the table.
const table = [
  { type: Prefix, ops: Operators({ Negate: '-' }) },
  { type: Postfix, ops: Operators({ Factorial: '!' }) },
  { type: BinaryRight, ops: Operators({ Exponentiate: '^' }) },
  { type: BinaryLeft, ops: Operators({ Multiply: '*', Divide: '/' }) },
  { type: BinaryLeft, ops: Operators({ Add: '+', Subtract: '-' }) },
  {
    type: BinaryLeft,
    ops: Operators({
      Equal: '==',
      NotEqual: '!=',
      GreaterThan: '>',
      LessThan: '<',
      GreaterThanOrEqualTo: '>=',
      LessThanOrEqualTo: '<='
    })
  },
  { type: Prefix, ops: Operators({ Not: '!' }) },
  { type: BinaryLeft, ops: Operators({ And: '&&' }) },
  { type: BinaryLeft, ops: Operators({ Or: '||' }) }
]

// The above is equivalent to:
//
// TYPE(operators({...}),
//   TYPE(operators({...}),
//     TYPE(operators({...})),
//       TYPE(operators({...}),
//         TYPE(operators({...}), ...))))
//
// But it's easier if to see what's going on and reorder the precedence if we
// keep it in a table instead of nesting it all manually.

// This is our version of a math expression.
const ArithmaticExpr = TableParser(table, Basic).trim(_)

module.exports = {
  ArithmaticExpr
}
