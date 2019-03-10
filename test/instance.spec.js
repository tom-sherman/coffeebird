const assert = require('assert')
const { Instance } = require('../src/instance')

describe('instance', function() {
  it('should parse valid instances', function() {
    const validInstances = [
      ['Person("Dave")', { name: 'Dave', type: 'Person' }],
      ['Person ("Dave")', { name: 'Dave', type: 'Person' }],
      ['Person ( "Dave" )', { name: 'Dave', type: 'Person' }],
      ['Person(\n\t"Dave"\n)', { name: 'Dave', type: 'Person' }],
      ['person("Dave")', { name: 'Dave', type: 'person' }]
    ]

    for (const [input, expected] of validInstances) {
      const { status, value } = Instance.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid instances', function() {
    const invalidInstances = ['Person', 'Person()', 'Person("Dave", more)']

    for (const input of invalidInstances) {
      assert.ok(!Instance.parse(input).status)
    }
  })
})
