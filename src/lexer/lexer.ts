import { Token, TokenType } from './token'
import { createReadStream, ReadStream } from 'fs'
import { lexBegin } from './functions'

export class Lexer {
  private nextState: LexerFunction = lexBegin
  readonly input: string
  width: number
  start = 0
  position = 0
  readonly tokens: Token[] = []
  // Stream must be an iterator so we can call for-of in Lexer.tokens
  // private readonly stream: LexerIterator
  // private currentChunk = ''

  constructor (input: string) {
    this.input = input
  }

  addToken (type: TokenType) {
    const value = this.input.slice(this.start, this.position)
    this.tokens.push(new Token({ type, value }))
    this.start = this.position
  }

  /**
   * Increment this position
   */
  increment (): void {
    this.position++
  }

  /**
   * Skip whitepace until we get something meaningful
   */
  skipWhitespace (): void {}

  /**
   * Peek `n` number of characters ahead of the current position and return the resulting string.
   * Doesn't affect lexer start or current position.
   */
  peek (n: number): string {
    return this.input.slice(this.position, this.position + n)
  }

  private error (err: LexerError): Error {
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
