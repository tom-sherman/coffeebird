const { Fact, FactDictionary } = require('../../src/parser/fact')

describe('fact :: dictionary', () => {
  it('should parse valid dictionaries', () => {
    const validDictionaries = [
      ['(cf:100)', { cf: 100 }],
      ['(cf:99)', { cf: 99 }],
      ['(cf:1)', { cf: 1 }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = FactDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid dictionaries', () => {
    const invalidDictionaries = [
      '(certainty:100)',
      '(foo)',
      '(cf:100',
      'cf:100)',
      '((cf:100))',
      'foo',
      '0',
      '(',
      ')',
      ''
    ]

    for (const input of invalidDictionaries) {
      expect(FactDictionary.parse(input).status).toBe(false)
    }
  })
})

describe('fact', () => {
  it('should parse valid facts', () => {
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
        '"Dave" - speaks lang - "English" (cf: 60)',
        {
          subject: 'Dave',
          rel: 'speaks lang',
          object: 'English',
          options: { cf: 60 }
        }
      ],
      [
        '"Dave" - speaks - "English" (cf: 60)',
        {
          subject: 'Dave',
          rel: 'speaks',
          object: 'English',
          options: { cf: 60 }
        }
      ],
      [
        '"Dave" - speaks - "English" (\n\tcf: 60\n)',
        {
          subject: 'Dave',
          rel: 'speaks',
          object: 'English',
          options: { cf: 60 }
        }
      ],
      [
        '"Dave" - speaks - "English"(\n\tcf: 60\n)',
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
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid facts', () => {
    const invalidFacts = [
      '',
      '()',
      'rel "Dave" - speaks - "English" (cf:60)',
      'Dave - speaks - English (cf:60)',
      '"Dave" - speaks - "English"" (cf:60)',
      '""Dave" - speaks - "English"" (cf:60)'
    ]

    for (const input of invalidFacts) {
      expect(Fact.parse(input).status).toBe(false)
    }
  })
})
