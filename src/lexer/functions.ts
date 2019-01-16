import { LexerFunction, Lexer } from './lexer'
import { TokenType, Token } from './token'
import { isSpace } from '../util'

/**
 * Entry point. Either returns lexKeyword (concept, rel definitions) or an lexWord for relinsts and concinsts
 */
export const lexBegin: LexerFunction = (lex: Lexer) => {
  lex.skipWhitespace()

  if (lex.inputStartsWithToken(TokenType.Keyword)) {
    return lexKeyword
  } else {
    return lexWord
  }
}

/**
 * Creates a token for `concept` and `rel` keywords and returns the corresponding function
 */
export const lexKeyword: LexerFunction = (lex: Lexer) => {
  while (!isSpace(lex.peek(1))) {
    lex.increment()
  }

  lex.addToken(TokenType.Keyword)
  return lexWord
}

/**
 * Handles the identifier for a concept, concinst, rel
 */
export const lexWord: LexerFunction = (lex: Lexer) => {
  while (lex.inputStartsWithToken(TokenType.WordCharacter)) {
    lex.increment()
  }
}

/**
 * Handles config keys in a key=value pair (rel, relinst, concept options)
 */
export const lexConfigKey: LexerFunction = (lex: Lexer) => {}

/**
 * Handles config values in a key=value pair (rel, relinst, concept options)
 */
export const lexConfigValue: LexerFunction = (lex: Lexer) => {}

export const lexLeftBracket: LexerFunction = (lex: Lexer) => {}

export const lexRightBracket: LexerFunction = (lex: Lexer) => {}

export const lexHyphen: LexerFunction = (lex: Lexer) => {}
