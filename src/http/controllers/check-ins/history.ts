import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInsUseCase } from '@/src/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySechma = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySechma.parse(request.query)
  const userId = request.user.sub

  const fetchUserCheckInsUseCase = makeFetchUserCheckInsUseCase()

  const { checkIns } = await fetchUserCheckInsUseCase.execute({
    page,
    userId,
  })

  return reply.status(200).send({ checkIns })
}
