export class Token {
  type: TokenType

  constructor (type: TokenType) {
    this.type = type
  }
}

export enum TokenType {
  LeftParen,
  RightParen,
  LeftBracket,
  RightBracket,
  EqualSign,
  Number
}

export const TokenMatchers = new Map<TokenType, string | RegExp>([
  [ TokenType.LeftParen, '(' ],
  [ TokenType.RightParen, ')' ],
  [ TokenType.LeftBracket, '{' ],
  [ TokenType.RightBracket, '}' ],
  [ TokenType.EqualSign, '=' ],
  [ TokenType.Number, /[0-9]/ ]
])
