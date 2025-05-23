import { CreateGymUseCase } from '../create-gym'
import { PrismaGymsRepository } from '@/src/repositories/prisma/prisma-gyms-repository'

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const createGymUseCase = new CreateGymUseCase(prismaGymsRepository)

  return createGymUseCase
}
