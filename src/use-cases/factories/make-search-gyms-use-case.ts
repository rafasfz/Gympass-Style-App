import { SearchGymsUseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/src/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(prismaGymsRepository)

  return searchGymsUseCase
}
