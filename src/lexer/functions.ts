import { LexerFunction, Lexer } from './lexer'
import { TokenType } from './token'
import { isSpace } from '../util'

/**
 * Entry point. Either returns lexKeyword (concept, rel definitions) or an lexIdentifier for relinsts and concinsts
 */
export const lexBegin: LexerFunction = (lex: Lexer) => {
  lex.skipWhitespace()

  if (lex.inputStartsWithToken(TokenType.Keyword)) {
    return lexKeyword
  } else {
    return lexIdentifier
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
  return lexIdentifier
}

/**
 * Handles the identifier for a concept, concinst, rel
 */
export const lexIdentifier: LexerFunction = (lex: Lexer) => {}

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
