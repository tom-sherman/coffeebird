/* global describe, it, expect */
const { Rel, RelDictionary, RelName } = require('../../src/parser/relationship')

describe('relationship :: dictionary', () => {
  it('should parse valid dictionaries', () => {
    const validDictionaries = [
      ['()', {}],
      ['( askable:none,allowCf:false )', { askable: 'none', allowCf: false }],
      [
        '(askable : secondFormObject, secondFormObject : "Where does %S live?")',
        { askable: 'secondFormObject', secondFormObject: 'Where does %S live?' }
      ],
      [
        '(askable : all, firstForm : "Does %S live in %O?")',
        { askable: 'all', firstForm: 'Does %S live in %O?' }
      ]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid askables', () => {
    const validDictionaries = [
      ['(askable: none)', { askable: 'none' }],
      ['(askable: all)', { askable: 'all' }],
      ['(askable: secondFormObject)', { askable: 'secondFormObject' }],
      ['(askable: secondFormSubject)', { askable: 'secondFormSubject' }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid canAdd', () => {
    const validDictionaries = [
      ['(canAdd: none)', { canAdd: 'none' }],
      ['(canAdd: all)', { canAdd: 'all' }],
      ['(canAdd: object)', { canAdd: 'object' }],
      ['(canAdd: subject)', { canAdd: 'subject' }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid plural', () => {
    const validDictionaries = [
      ['(plural: true)', { plural: true }],
      ['(plural: false)', { plural: false }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid allowCf', () => {
    const validDictionaries = [
      ['(allowCf: true)', { allowCf: true }],
      ['(allowCf: false)', { allowCf: false }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid allowUnknown', () => {
    const validDictionaries = [
      ['(allowUnknown: true)', { allowUnknown: true }],
      ['(allowUnknown: false)', { allowUnknown: false }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = RelDictionary.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })
})

describe('relationship :: RelName', () => {
  it('should parse valid names', () => {
    const validNames = ['speaks', 'does speaks', 'foo bar baz']

    for (const input of validNames) {
      const { status, value } = RelName.parse(input)
      expect(status).toBe(true)
      expect(input).toBe(value)
    }
  })

  it('should not parse invalid names', () => {
    const invalidNames = ['', '-', '()', 'speaks4', '4speaks']

    for (const input of invalidNames) {
      expect(RelName.parse(input).status).toBe(false)
    }
  })
})

describe('relationship', () => {
  it('should parse valid relationships', () => {
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
        'rel Person - speaks - Language (askable: none)',
        {
          subject: 'Person',
          name: 'speaks',
          object: 'Language',
          options: { askable: 'none' }
        }
      ],
      [
        'rel Person - speaks - Language (\n\taskable: none\n)',
        {
          subject: 'Person',
          name: 'speaks',
          object: 'Language',
          options: { askable: 'none' }
        }
      ]
    ]

    for (const [input, expected] of validRels) {
      const { status, value } = Rel.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid relationships', () => {
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
      'Person - speaks - Language',
      'relPerson - speaks - Language'
    ]

    for (const input of invalidRels) {
      expect(Rel.parse(input).status).toBe(false)
    }
  })
})
