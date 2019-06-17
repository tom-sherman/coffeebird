/* global describe, it, expect */

const { RBLANG_FUNCTIONS } = require('../src/transform/expression')
const {
  round,
  countRelationshipInstances,
  isSubset,
  min,
  now,
  today,
  sumObjects
} = RBLANG_FUNCTIONS

describe('round', () => {
  it('should be valid', () => {
    expect(() =>
      round.validate({ function: 'round', arguments: [1.5] })
    ).not.toThrow()
    expect(() =>
      round.validate({ function: 'round', arguments: [1, 2] })
    ).not.toThrow()
    expect(() =>
      round.validate({ function: 'round', arguments: [{ name: 'FOO' }] })
    ).not.toThrow()
    expect(() =>
      round.validate({
        function: 'round',
        arguments: [{ name: 'FOO' }, { name: 'BAR' }]
      })
    ).not.toThrow()
    expect(() =>
      round.validate({ function: 'round', arguments: [['Add', 3, 4]] })
    ).not.toThrow()
  })

  it('should throw when passing too many args', () => {
    expect(() =>
      round.validate({ function: 'round', arguments: [1, 2, 3] })
    ).toThrow()
  })

  it('should throw when passing too few args', () => {
    expect(() => round.validate({ function: 'round', arguments: [] })).toThrow()
  })

  it('should throw when passing wrong type of args', () => {
    expect(() =>
      round.validate({ function: 'round', arguments: ['1'] })
    ).toThrow()
    expect(() =>
      round.validate({ function: 'round', arguments: [1, '2'] })
    ).toThrow()
  })
})

describe('countRelationshipInstances', () => {
  it('should be valid', () => {
    expect(() =>
      countRelationshipInstances.validate({
        function: 'countRelationshipInstances',
        arguments: ['foo', 'bar', 'baz']
      })
    ).not.toThrow()
    expect(() =>
      countRelationshipInstances.validate({
        function: 'countRelationshipInstances',
        arguments: [{ name: 'S' }, 'bar', '*']
      })
    ).not.toThrow()
  })

  it('should throw with invalid arguments', () => {
    expect(() =>
      countRelationshipInstances.validate({
        function: 'countRelationshipInstances',
        arguments: []
      })
    ).toThrow()
  })
})

describe('isSubset', () => {
  it('should be valid', () => {
    expect(() =>
      isSubset.validate({
        function: 'isSubset',
        arguments: [{ name: 'S' }, 'foo', '*', { name: 'O' }, 'bar', '*']
      })
    )
  })
})

describe('sumObjects', () => {
  it('should be valid', () => {
    expect(() =>
      sumObjects.validate({
        function: 'sumObjects',
        arguments: [{ name: 'S' }, 'has num', '*']
      })
    ).not.toThrow()
  })

  it('should be invalid', () => {
    expect(() =>
      sumObjects.validate({
        function: 'sumObjects',
        arguments: ['Dave', 'has num', { name: 'FOO' }]
      })
    ).toThrow()
  })
})

describe('min/max', () => {
  it('should be valid', () => {
    expect(() =>
      min.validate({
        function: 'min',
        arguments: [4]
      })
    ).not.toThrow()
    expect(() =>
      min.validate({
        function: 'min',
        arguments: [{ name: 'FOO' }]
      })
    ).not.toThrow()
  })
})

describe('now/today', () => {
  it('should be valid', () => {
    expect(() =>
      now.validate({
        function: 'now',
        arguments: []
      })
    ).not.toThrow()
    expect(() =>
      today.validate({
        function: 'today',
        arguments: []
      })
    ).not.toThrow()
  })

  it('should be invalid with > 0 arguments', () => {
    expect(() =>
      now.validate({
        function: 'now',
        arguments: [1]
      })
    ).toThrow()
    expect(() =>
      now.validate({
        function: 'today',
        arguments: [1]
      })
    ).toThrow()
  })
})
