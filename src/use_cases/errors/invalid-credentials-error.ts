import { GlobalHttpError } from '@/src/errors'

export class InvalidCredentialsError extends Error implements GlobalHttpError {
  statusCode = 401
  constructor() {
    super('Invalid credentials.')
  }
}
