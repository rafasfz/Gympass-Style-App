import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/src/use-cases/factories/make-get-user-metrics-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const searchGymsUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await searchGymsUseCase.execute({
    userId,
  })

  return reply.status(200).send({ checkInsCount })
}
