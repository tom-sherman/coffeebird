const P = require('parsimmon')
const assert = require('assert')
const { FunctionArguments } = require('../../src/parser/condition/function')

describe('functions', function() {
  it('should parse function arguments with single argument', function() {
    const oneArgument = FunctionArguments(P.string('foo'))

    const validInputs = ['(foo)', '( foo )']

    const expected = ['foo']

    for (const input of validInputs) {
      const parsed = oneArgument.parse(input)
      assert.ok(parsed.status)
      assert.deepEqual(parsed.value, expected)
    }
  })

  it('should parse function arguments with multiple arguments', function() {
    const twoArguments = FunctionArguments(P.string('foo'), P.string('bar'))
    const threeArguments = FunctionArguments(
      P.string('foo'),
      P.string('bar'),
      P.string('baz')
    )

    const twoArgumentInputs = [
      '(foo,bar)',
      '(foo, bar)',
      '( foo, bar )',
      '( foo , bar )'
    ]

    const expectedTwoArguments = ['foo', 'bar']

    for (const input of twoArgumentInputs) {
      const parsed = twoArguments.parse(input)
      assert.ok(parsed.status)
      assert.deepEqual(parsed.value, expectedTwoArguments)
    }

    const threeArgumentInputs = [
      '(foo, bar, baz)',
      '(foo,bar, baz)',
      '(foo,bar,baz)',
      '(foo, bar,baz)',
      '( foo , bar , baz )'
    ]

    const expectedThreeArguments = ['foo', 'bar', 'baz']

    for (const input of threeArgumentInputs) {
      const parsed = threeArguments.parse(input)
      assert.ok(parsed.status)
      assert.deepEqual(parsed.value, expectedThreeArguments)
    }
  })
})
