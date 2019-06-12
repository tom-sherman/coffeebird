const {
  Rule,
  RuleDictionary,
  RuleSubject,
  RuleObject
} = require('../../src/parser/rule')

describe('rule :: dictionary', () => {
  it('should parse valid dictionaries', () => {
    const validDictionaries = [
      ['()', {}],
      ['(cf: 100)', { cf: 100 }],
      [
        '(cf: 100, minimumRuleCertainty: 50)',
        { cf: 100, minimumRuleCertainty: 50 }
      ],
      ['(alt: "Test")', { alt: 'Test' }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RuleDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid dictionaries', () => {
    const invalidDictionaries = ['(', ')', '(alt=)', '(alt:)', '(cf : 20.4)']

    for (const input of invalidDictionaries) {
      expect(RuleDictionary.parse(input).status).toBe(false)
    }
  })
})

describe('rule :: triple', () => {
  it.todo('should parse valid subjects')
  it.todo('should not parse invalid subjects')
  it.todo('should parse valid objects')
  it.todo('should not parse invalid objects')
})

describe('rule', () => {
  it('should parse valid rules', () => {
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
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid rules', () => {
    const invalidRules = [
      'speaks',
      'speaks - () {}',
      '"Tom" - - "English {}',
      '"Tom" {}',
      'speaks ()',
      'speaks {\n\t%S - lives in - %COUNTRY\n\t%COUNTRY - has national language - %O\n}'
    ]

    for (const input of invalidRules) {
      expect(Rule.parse(input).status).toBe(false)
    }
  })
})
