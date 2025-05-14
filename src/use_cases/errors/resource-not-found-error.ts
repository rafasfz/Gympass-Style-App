import { GlobalHttpError } from '@/src/errors'

export class ResourceNotFoundError extends Error implements GlobalHttpError {
  statusCode = 404
  constructor(resourceName: string) {
    super(`${resourceName} not found`)
  }
}
