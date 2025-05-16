import { GlobalHttpError } from '@/src/errors'

export class UserDontExistsError extends GlobalHttpError {
  statusCode = 404
  constructor() {
    super('User already exists.')
  }
}
