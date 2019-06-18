/* global describe, it, expect */
const { Expression } = require('../../src/parser/condition/expression')

describe('expression', () => {
  it('should parse prefix operators', () => {
    expect(Expression.tryParse('!true')).toMatchSnapshot()
    expect(Expression.tryParse('!%BAR')).toMatchSnapshot()
    expect(Expression.tryParse('-5')).toMatchSnapshot()
  })

  it('should parse arithmetic expressions', () => {
    expect(Expression.tryParse('1 + 1')).toMatchSnapshot()
    expect(Expression.tryParse('1 * 1')).toMatchSnapshot()
    expect(Expression.tryParse('1 - 1')).toMatchSnapshot()
    expect(Expression.tryParse('1 / 1')).toMatchSnapshot()
    expect(Expression.tryParse('1 % 1')).toMatchSnapshot()
    expect(Expression.tryParse('2 + 3 * 4')).toMatchSnapshot()
    expect(Expression.tryParse('(2 + 3) * 4')).toMatchSnapshot()
  })

  it('should parse boolean expressions', () => {
    expect(Expression.tryParse('true and false')).toMatchSnapshot()
    expect(Expression.tryParse('true or false')).toMatchSnapshot()
    expect(Expression.tryParse('true or false and false')).toMatchSnapshot()
    expect(Expression.tryParse('(true or false) and false')).toMatchSnapshot()
  })

  it('should parse comparative expressions', () => {
    expect(Expression.tryParse('4 > 3')).toMatchSnapshot()
    expect(Expression.tryParse('2 < 1')).toMatchSnapshot()
    expect(Expression.tryParse('1 >= 2')).toMatchSnapshot()
    expect(Expression.tryParse('1 <= 2')).toMatchSnapshot()
    expect(Expression.tryParse('"foo" == "foo"')).toMatchSnapshot()
    expect(Expression.tryParse('"foo" != "bar"')).toMatchSnapshot()
  })

  it('should parse with variables', () => {
    expect(Expression.tryParse('%FOO')).toMatchSnapshot()
    expect(Expression.tryParse('%FOO + %BAR')).toMatchSnapshot()
    expect(Expression.tryParse('%FOO == %BAR')).toMatchSnapshot()
    expect(Expression.tryParse('%FOO1 % %BAR2')).toMatchSnapshot()
  })

  it('should parse mixed expressions', () => {
    expect(Expression.tryParse('%FOO * 3 == 24')).toMatchSnapshot()
    expect(Expression.tryParse('-(%FOO - 4)')).toMatchSnapshot()
    expect(Expression.tryParse('!(%FOO - 4)')).toMatchSnapshot()
    expect(Expression.tryParse('%FOO != "foo" and %BAR > 2')).toMatchSnapshot()
  })
})
