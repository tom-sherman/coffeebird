const assert = require('assert')
const { Rel, RelDictionary, RelName } = require('../src/relationship')

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

describe('relationship :: RelName', function () {
  it('should parse valid names', function () {
    const validNames = [
      'speaks',
      'does speaks',
      'foo bar baz'
    ]

    for (const input of validNames) {
      const { status, value } = RelName.parse(input)
      assert.ok(status)
      assert.equal(input, value)
    }
  })

  it('should not parse invalid names', function () {
    const invalidNames = [
      '',
      '-',
      '()',
      'speaks4',
      '4speaks'
    ]

    for (const input of invalidNames) {
      assert.ok(!RelName.parse(input).status)
    }
  })
})

describe('relationship', function () {
  it('should parse valid relationships', function () {
    const validRels = [
      [
        'rel Person - speaks - Language',
        { subject: 'Person', name: 'speaks', object: 'Language', options: {} }
      ],
      [
        'rel Person - speaks - Language ()',
        { subject: 'Person', name: 'speaks', object: 'Language', options: {} }
      ],
      [
        'rel Person - speaks - Language (askable=none)',
        { subject: 'Person', name: 'speaks', object: 'Language', options: { askable: 'none' } }
      ],
      [
        'rel Person - speaks - Language (\n\taskable=none\n)',
        { subject: 'Person', name: 'speaks', object: 'Language', options: { askable: 'none' } }
      ],
    ]

    for (const [ input, expected ] of validRels) {
      const { status, value } = Rel.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid relationships', function () {
    const invalidRels = [
      'rel',
      '',
      '()',
      'rel Person',
      'rel Person -',
      'rel Person - speaks',
      'rel Person - speaks -',
      'rel - speaks -',
      'rel - speaks -',
      'rel - speaks - Language',
      'rel Person -- speaks - Language',
      'Person - speaks - Language'
    ]

    for (const input of invalidRels) {
      assert.ok(!Rel.parse(input).status)
    }
  })
})
