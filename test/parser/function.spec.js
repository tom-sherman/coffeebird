const P = require('parsimmon')
const { FunctionArguments } = require('../../src/parser/condition/function')

describe('functions', () => {
  it('should parse function arguments with single argument', () => {
    const oneArgument = FunctionArguments(P.string('foo'))

    const validInputs = ['(foo)', '( foo )']

    const expected = ['foo']

    for (const input of validInputs) {
      const { status, value } = oneArgument.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse function arguments with multiple arguments', () => {
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
      const { status, value } = twoArguments.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expectedTwoArguments)
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
      const { status, value } = threeArguments.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expectedThreeArguments)
    }
  })
})
