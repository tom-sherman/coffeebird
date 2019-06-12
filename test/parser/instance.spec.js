/* global describe, it, expect */
const { Instance } = require('../../src/parser/instance')

describe('instance', () => {
  it('should parse valid instances', () => {
    const validInstances = [
      ['Person("Dave")', { name: 'Dave', type: 'Person' }],
      ['Person ("Dave")', { name: 'Dave', type: 'Person' }],
      ['Person ( "Dave" )', { name: 'Dave', type: 'Person' }],
      ['Person(\n\t"Dave"\n)', { name: 'Dave', type: 'Person' }],
      ['person("Dave")', { name: 'Dave', type: 'person' }]
    ]

    for (const [input, expected] of validInstances) {
      const { status, value } = Instance.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid instances', () => {
    const invalidInstances = ['Person', 'Person()', 'Person("Dave", more)']

    for (const input of invalidInstances) {
      expect(Instance.parse(input).status).toBe(false)
    }
  })
})
