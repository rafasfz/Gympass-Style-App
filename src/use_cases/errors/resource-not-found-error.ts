import { GlobalHttpError } from '@/src/errors'

export class ResourceNotFoundError extends Error implements GlobalHttpError {
  statusCode = 404
  constructor() {
    super('Resource not found.')
  }
}
