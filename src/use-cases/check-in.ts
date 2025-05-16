import { CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { GymsRepository } from '../repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinatesInMeters } from '../utils/get-distance-between-coordinates'
import { MAX_DISTANCE_TO_CHECK_IN_IN_METERS } from '../settings'
import { MaxDistanceError } from './errors/max-distance.error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

interface CheckinsUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckinsUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckinsUseCaseRequest): Promise<CheckinsUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError('Gym not found')
    }

    const distanceInMeters = getDistanceBetweenCoordinatesInMeters(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    if (distanceInMeters > MAX_DISTANCE_TO_CHECK_IN_IN_METERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
