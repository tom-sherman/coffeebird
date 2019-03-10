const assert = require('assert')
const { Fact, FactDictionary } = require('../src/fact')

describe('fact :: dictionary', function() {
  it('should parse valid dictionaries', function() {
    const validDictionaries = [
      ['', {}],
      ['()', {}],
      ['(cf=100)', { cf: 100 }],
      ['(cf=99)', { cf: 99 }],
      ['(cf=1)', { cf: 1 }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = FactDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid dictionaries', function() {
    const invalidDictionaries = [
      '(certainty=100)',
      '(foo)',
      '(cf=100',
      'cf=100)',
      '((cf=100))',
      'foo',
      '0',
      '(',
      ')'
    ]

    for (const input of invalidDictionaries) {
      assert.ok(!FactDictionary.parse(input).status)
    }
  })
})

describe('fact', function() {
  it('should parse valid facts', function() {
    const validFacts = [
      [
        '"Dave" - speaks - "English"',
        { subject: 'Dave', rel: 'speaks', object: 'English', options: {} }
      ],
      [
        '"Dave" - speaks - "English" ()',
        { subject: 'Dave', rel: 'speaks', object: 'English', options: {} }
      ],
      [
        '"Dave" - speaks lang - "English" (cf=60)',
        {
          subject: 'Dave',
          rel: 'speaks lang',
          object: 'English',
          options: { cf: 60 }
        }
      ],
      [
        '"Dave" - speaks - "English" (cf=60)',
        {
          subject: 'Dave',
          rel: 'speaks',
          object: 'English',
          options: { cf: 60 }
        }
      ],
      [
        '"Dave" - speaks - "English" (\n\tcf=60\n)\n',
        {
          subject: 'Dave',
          rel: 'speaks',
          object: 'English',
          options: { cf: 60 }
        }
      ]
    ]

    for (const [input, expected] of validFacts) {
      const { status, value } = Fact.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid facts', function() {
    const invalidFacts = [
      '',
      '()',
      'rel "Dave" - speaks - "English" (cf=60)',
      'Dave - speaks - English (cf=60)',
      '"Dave" - speaks - "English"" (cf=60)',
      '""Dave" - speaks - "English"" (cf=60)'
    ]

    for (const input of invalidFacts) {
      assert.ok(!Fact.parse(input).status)
    }
  })
})
