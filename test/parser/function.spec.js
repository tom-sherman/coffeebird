/* global describe, it, expect */
const {
  FunctionArguments,
  FunctionCall
} = require('../../src/parser/condition/function')

describe('functions arguments', () => {
  it('should parse function arguments with 0 arguments', () => {
    expect(FunctionArguments.tryParse('')).toEqual([])
    expect(FunctionArguments.tryParse(' ')).toEqual([])
    expect(FunctionArguments.tryParse('\n')).toEqual([])
  })

  it('should parse function arguments with single argument', () => {
    const expected = ['foo']
    expect(FunctionArguments.tryParse('"foo"')).toEqual(expected)
    expect(FunctionArguments.tryParse(' "foo" ')).toEqual(expected)

    expect(FunctionArguments.tryParse('*')).toEqual(['*'])
    expect(FunctionArguments.tryParse('1')).toEqual([1])
    expect(FunctionArguments.tryParse('1.1')).toEqual([1.1])
    expect(FunctionArguments.tryParse('3 + 1')).toEqual([['Add', 3, 1]])
  })

  it('should parse function arguments with multiple arguments', () => {
    const expectedTwoArguments = ['foo', 'bar']
    expect(FunctionArguments.tryParse('"foo","bar"')).toEqual(
      expectedTwoArguments
    )
    expect(FunctionArguments.tryParse('"foo", "bar"')).toEqual(
      expectedTwoArguments
    )
    expect(FunctionArguments.tryParse(' "foo", "bar" ')).toEqual(
      expectedTwoArguments
    )
    expect(FunctionArguments.tryParse(' "foo" , "bar" ')).toEqual(
      expectedTwoArguments
    )

    expect(FunctionArguments.tryParse('3 + 1, 4 + 2')).toEqual([
      ['Add', 3, 1],
      ['Add', 4, 2]
    ])

    const expectedThreeArguments = ['foo', 'bar', 'baz']
    expect(FunctionArguments.tryParse('"foo", "bar", "baz"')).toEqual(
      expectedThreeArguments
    )
    expect(FunctionArguments.tryParse('"foo","bar", "baz"')).toEqual(
      expectedThreeArguments
    )
    expect(FunctionArguments.tryParse('"foo","bar","baz"')).toEqual(
      expectedThreeArguments
    )
    expect(FunctionArguments.tryParse('"foo", "bar","baz" ')).toEqual(
      expectedThreeArguments
    )
    expect(FunctionArguments.tryParse(' "foo" , "bar" , "baz" ')).toEqual(
      expectedThreeArguments
    )
  })

  it('should throw with invalid arguments', () => {
    expect(() => FunctionArguments.tryParse('invalidArgument')).toThrow()
    expect(() => FunctionArguments.tryParse('"trailing comma",')).toThrow()
    expect(() => FunctionArguments.tryParse(',"trailing comma"')).toThrow()
  })
})

describe('function call', () => {
  it('should parse valid function calls', () => {
    expect(FunctionCall.tryParse('foo()')).toEqual({
      function: 'foo',
      arguments: []
    })
    expect(FunctionCall.tryParse('foo(  )')).toEqual({
      function: 'foo',
      arguments: []
    })
    expect(FunctionCall.tryParse('foo(1)')).toEqual({
      function: 'foo',
      arguments: [1]
    })
    expect(FunctionCall.tryParse('foo(1.1, "bar")')).toEqual({
      function: 'foo',
      arguments: [1.1, 'bar']
    })
    expect(FunctionCall.tryParse('foo(3 + 1)')).toEqual({
      function: 'foo',
      arguments: [['Add', 3, 1]]
    })
  })

  it('should throw on invalid function calls', () => {
    expect(() => FunctionCall.tryParse('foo')).toThrow()
    expect(() => FunctionCall.tryParse('foo(')).toThrow()
    expect(() => FunctionCall.tryParse('foo(  ')).toThrow()
    expect(() => FunctionCall.tryParse('foo)')).toThrow()
    expect(() => FunctionCall.tryParse('foo(1')).toThrow()
    expect(() => FunctionCall.tryParse('foo(1,')).toThrow()
    expect(() => FunctionCall.tryParse('foo(1,2')).toThrow()
    expect(() => FunctionCall.tryParse('foo(1,)')).toThrow()
    expect(() => FunctionCall.tryParse('foo(1,2,)')).toThrow()
    expect(() => FunctionCall.tryParse('(1,2)')).toThrow()
    expect(() => FunctionCall.tryParse('()')).toThrow()
  })
})
