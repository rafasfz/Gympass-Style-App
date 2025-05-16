import { PrismaCheckInsRepository } from '@/src/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const validateCheckinUseCase = new ValidateCheckInUseCase(
    prismaCheckInsRepository,
  )

  return validateCheckinUseCase
}
