import { GlobalHttpError } from '@/src/errors'

export class InvalidCredentialsError extends GlobalHttpError {
  statusCode = 400
  constructor() {
    super('Invalid credentials.')
  }
}
