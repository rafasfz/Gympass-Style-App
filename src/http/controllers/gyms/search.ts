import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/src/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySechma = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsQuerySechma.parse(request.query)

  const createGymUseCase = makeSearchGymsUseCase()

  const { gyms } = await createGymUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({ gyms })
}
