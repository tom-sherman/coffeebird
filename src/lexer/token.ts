export class Token {
  type: TokenType
  value: string

  constructor ({ type, value }: TokenOptions) {
    this.type = type
    this.value = value
  }
}

interface TokenOptions {
  type: TokenType
  value: string
}

export enum TokenType {
  EOF,
  LeftParen,
  RightParen,
  LeftBracket,
  RightBracket,
  EqualSign,
  Number,
  Keyword,
  Hyphen
}

export const TokenMatchers = new Map<TokenType, string | RegExp>([
  [ TokenType.LeftParen, '(' ],
  [ TokenType.RightParen, ')' ],
  [ TokenType.LeftBracket, '{' ],
  [ TokenType.RightBracket, '}' ],
  [ TokenType.EqualSign, '=' ],
  [ TokenType.Number, /[0-9]/ ],
  [ TokenType.Keyword, /(concept|rel)/ ],
  [ TokenType.Hyphen, '-' ]
])
