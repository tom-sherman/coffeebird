const assert = require('assert')
const { Concept, ConceptDictionary } = require('../../src/parser/concept')

describe('concept :: dictionary', function() {
  it('should parse valid dictionaries', function() {
    const validDictionaries = [
      ['()', {}],
      ['(type=string)', { type: 'string' }],
      ['( type = string )', { type: 'string' }],
      ['( type=string )', { type: 'string' }],
      ['(type = string)', { type: 'string' }],
      ['(type = number)', { type: 'number' }],
      ['(type = truth)', { type: 'truth' }],
      ['(type = date)', { type: 'date' }],
      ['(behaviour = mutuallyExclusive)', { behaviour: 'mutuallyExclusive' }],
      [
        '(type = string, behaviour = mutuallyExclusive)',
        { behaviour: 'mutuallyExclusive', type: 'string' }
      ],
      [
        '(behaviour = mutuallyExclusive, type = string)',
        { behaviour: 'mutuallyExclusive', type: 'string' }
      ]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = ConceptDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid dictionaries', function() {
    const invalidDictionaries = [
      '(string)',
      '(type)',
      'type=string',
      '(behaviour = string)',
      '0',
      'true',
      '(true = string)',
      '(,)',
      '(,,)',
      '(type = string,)',
      ''
    ]

    for (const input of invalidDictionaries) {
      assert.ok(!ConceptDictionary.parse(input).status)
    }
  })
})

describe('concept', function() {
  it('should parse valid concepts', function() {
    const validConcepts = [
      ['concept Language', { name: 'Language', options: {} }],
      ['concept Language ()', { name: 'Language', options: {} }],
      ['concept Language()', { name: 'Language', options: {} }],
      [
        'concept Foo (type=string)',
        { name: 'Foo', options: { type: 'string' } }
      ],
      [
        'concept Foo( type=string )',
        { name: 'Foo', options: { type: 'string' } }
      ],
      [
        'concept Foo(\n\ttype=string\n)',
        { name: 'Foo', options: { type: 'string' } }
      ]
    ]

    for (const [input, expected] of validConcepts) {
      const { status, value } = Concept.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid concepts', function() {
    const invalidConcepts = [
      '',
      '()',
      '0',
      'concept',
      'conceptLanguage',
      'concept (type = string)',
      'concept ()',
      'Language ()'
    ]

    for (const input of invalidConcepts) {
      assert.ok(!Concept.parse(input).status)
    }
  })
})
