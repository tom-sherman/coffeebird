import { Token, TokenType } from './token';
import { createReadStream, ReadStream } from 'fs'

export class Lexer {
  private nextState: LexerFunction
  input: string
  width: number
  start = 0
  position: number
  readonly tokens: Token[] = []
  // Stream must be an iterator so we can call for-of in Lexer.tokens
  // private readonly stream: LexerIterator
  // private currentChunk = ''

  constructor (input: string) {
    this.input = input
  }

  addToken (type: TokenType) {
    const value =
    this.tokens.push(new Token({ type }))
  }

  /**
   * Increment this position
   */
  increment () {}

  /**
   * Skip whitepace until we get something meaningful
   */
  skipWhitespace () {}

  private error (err: LexerError) {
    if (err === LexerError.UNEXPECTED_EOF) {
      return new Error('Unexpected end of file.')
    } else if (err === LexerError.CHUNK_NOT_STRING) {
      return new Error('Chunk is somehow not a string.')
    }

    throw new Error('Huh?')
  }
}

export interface LexerFunction {
  (): LexerFunction
}

enum LexerError {
  UNEXPECTED_EOF,
  CHUNK_NOT_STRING
}

interface LexerOptions {
  path: string
  encoding?: string
  highWaterMark?: number
}

type LexerIterator = string[] | ReadStream
