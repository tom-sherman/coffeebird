const assert = require('assert')
const { Rel, RelDictionary } = require('../src/relationship')

describe('relationship :: dictionary', function () {
  it('should parse valid dictionaries', function () {
    const validDictionaries = [
      [ '()', {} ],
      [ '', {} ],
      [ '( askable=none,allowCf=false )', { askable: 'none', allowCf: false } ]
    ]

    for (const [ input, expected ] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid askables', function () {
    const validDictionaries = [
      [ '(askable=none)', { askable: 'none' } ],
      [ '(askable=all)', { askable: 'all' } ],
      [ '(askable=secondFormObject)', { askable: 'secondFormObject' } ],
      [ '(askable=secondFormSubject)', { askable: 'secondFormSubject' } ],
    ]

    for (const [ input, expected ] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid canAdd', function () {
    const validDictionaries = [
      [ '(canAdd=none)', { canAdd: 'none' } ],
      [ '(canAdd=all)', { canAdd: 'all' } ],
      [ '(canAdd=object)', { canAdd: 'object' } ],
      [ '(canAdd=subject)', { canAdd: 'subject' } ],
    ]

    for (const [ input, expected ] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid plural', function () {
    const validDictionaries = [
      [ '(plural=true)', { plural: true } ],
      [ '(plural=false)', { plural: false } ]
    ]

    for (const [ input, expected ] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid allowCf', function () {
    const validDictionaries = [
      [ '(allowCf=true)', { allowCf: true } ],
      [ '(allowCf=false)', { allowCf: false } ]
    ]

    for (const [ input, expected ] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid allowUnknown', function () {
    const validDictionaries = [
      [ '(allowUnknown=true)', { allowUnknown: true } ],
      [ '(allowUnknown=false)', { allowUnknown: false } ]
    ]

    for (const [ input, expected ] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })
})
