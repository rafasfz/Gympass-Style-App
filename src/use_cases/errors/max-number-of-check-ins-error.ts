import { GlobalHttpError } from '@/src/errors'

export class MaxNumberOfCheckInsError extends Error implements GlobalHttpError {
  statusCode = 400
  constructor() {
    super('Max number of check-ins reached.')
  }
}
