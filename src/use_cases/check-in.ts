import { CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface CheckinsUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckinsUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckinsUseCaseRequest): Promise<CheckinsUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
