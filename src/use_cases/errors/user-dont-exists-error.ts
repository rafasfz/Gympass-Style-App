import { GlobalHttpError } from '@/src/errors'

export class UserDontExistsError extends Error implements GlobalHttpError {
  statusCode = 404
  constructor() {
    super('User already exists.')
  }
}
