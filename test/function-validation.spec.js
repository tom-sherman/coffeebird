/* global describe, it, expect */

const { RBLANG_FUNCTIONS } = require('../src/transform/functions')
const { round, countRelationshipInstances } = RBLANG_FUNCTIONS

describe.skip('function validation', () => {
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
          arguments: [{ name: 'FOO', name: 'BAR' }]
        })
      ).not.toThrow()
    })

    it('should throw when passing too many args', () => {
      expect(() =>
        round.validate({ function: 'round', arguments: [1, 2, 3] })
      ).toThrow()
    })

    it('should throw when passing too few args', () => {
      expect(() =>
        round.validate({ function: 'round', arguments: [] })
      ).toThrow()
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
  })
})
