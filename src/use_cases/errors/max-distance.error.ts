import { GlobalHttpError } from '@/src/errors'
import { MAX_DISTANCE_TO_CHECK_IN_IN_METERS } from '@/src/settings'

export class MaxDistanceError extends Error implements GlobalHttpError {
  statusCode = 400
  constructor() {
    super(
      `Distance to check in is more than ${MAX_DISTANCE_TO_CHECK_IN_IN_METERS} meters.`,
    )
  }
}
