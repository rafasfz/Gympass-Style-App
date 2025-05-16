import { GlobalHttpError } from '@/src/errors'

export class MaxNumberOfCheckInsError extends GlobalHttpError {
  statusCode = 400
  constructor() {
    super('Max number of check-ins reached.')
  }
}
