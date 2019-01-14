import { LexerFunction, Lexer } from './lexer'

/**
 * Entry point. Either returns lexKeyword (concept, rel definitions) or an lexIdentifier for relinsts and concinsts
 */
export const lexBegin: LexerFunction = (lex: Lexer) => {}

/**
 * Creates a token for `concept` and `rel` keywords and returns the corresponding function
 */
export const lexKeyword: LexerFunction = (lex: Lexer) => {}

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
