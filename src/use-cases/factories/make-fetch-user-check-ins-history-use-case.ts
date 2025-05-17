import { PrismaCheckInsRepository } from '@/src/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
    prismaCheckInsRepository,
  )

  return fetchUserCheckInsHistoryUseCase
}
