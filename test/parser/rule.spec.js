const assert = require('assert')
const {
  Rule,
  RuleDictionary,
  RuleSubject,
  RuleObject
} = require('../../src/parser/rule')

describe('rule :: dictionary', function() {
  it('should parse valid dictionaries', function() {
    const validDictionaries = [
      ['()', {}],
      ['(cf = 100)', { cf: 100 }],
      [
        '(cf = 100, minimumRuleCertainty = 50)',
        { cf: 100, minimumRuleCertainty: 50 }
      ],
      ['(alt = "Test")', { alt: 'Test' }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RuleDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid dictionaries', function() {
    const invalidDictionaries = ['(', ')', '(alt=)', '(cf = 20.4)']

    for (const input of invalidDictionaries) {
      assert.ok(!RuleDictionary.parse(input).status)
    }
  })
})

describe('rule :: triple', function() {
  it('should parse valid subjects')
  it('should not parse invalid subjects')
  it('should parse valid objects')
  it('should not parse invalid objects')
})

describe('rule', function() {
  it('should parse valid rules', function() {
    const validRules = [
      [
        'speaks {}',
        {
          subject: null,
          rel: 'speaks',
          object: null,
          conditions: [],
          options: {}
        }
      ],
      [
        'speaks () {}',
        {
          subject: null,
          rel: 'speaks',
          object: null,
          conditions: [],
          options: {}
        }
      ],
      [
        'speaks {\n\t%S - lives in - %COUNTRY;\n\t%COUNTRY - has national language - %O\n}',
        {
          subject: null,
          rel: 'speaks',
          object: null,
          conditions: [
            {
              type: 'rel',
              subject: { name: 'S' },
              rel: 'lives in',
              object: { name: 'COUNTRY' },
              options: {}
            },
            {
              type: 'rel',
              subject: { name: 'COUNTRY' },
              rel: 'has national language',
              object: { name: 'O' },
              options: {}
            }
          ],
          options: {}
        }
      ],
      [
        'speaks {\n\t%S - lives in - %COUNTRY;\n\t%COUNTRY - has national language - %O;\n}',
        {
          subject: null,
          rel: 'speaks',
          object: null,
          conditions: [
            {
              type: 'rel',
              subject: { name: 'S' },
              rel: 'lives in',
              object: { name: 'COUNTRY' },
              options: {}
            },
            {
              type: 'rel',
              subject: { name: 'COUNTRY' },
              rel: 'has national language',
              object: { name: 'O' },
              options: {}
            }
          ],
          options: {}
        }
      ]
    ]

    for (const [input, expected] of validRules) {
      const { status, value } = Rule.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid rules', function() {
    const invalidRules = [
      'speaks',
      'speaks - () {}',
      '"Tom" - - "English {}',
      '"Tom" {}',
      'speaks ()',
      'speaks {\n\t%S - lives in - %COUNTRY\n\t%COUNTRY - has national language - %O\n}'
    ]

    for (const input of invalidRules) {
      assert.ok(!Rule.parse(input).status)
    }
  })
})
