import { GlobalHttpError } from '@/src/errors'
import { MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES } from '@/src/settings'

export class LateCheckInValidationError extends GlobalHttpError {
  statusCode = 400
  constructor() {
    super(
      `The Check-In can only be valited until ${MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES} minutes of its creation`,
    )
  }
}
