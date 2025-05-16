import { CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES } from '../settings'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckinsUseCaseRequest {
  checkInId: string
}

interface ValidateCheckinsUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckinsUseCaseRequest): Promise<ValidateCheckinsUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError('Check In')
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (
      distanceInMinutesFromCheckInCreation >
      MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES
    ) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
