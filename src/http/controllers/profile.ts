import { makeGetUserProfileUseCase } from '@/src/use_cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserPorfile = makeGetUserProfileUseCase()

  const userId = request.user.sub
  const { user } = await getUserPorfile.execute({ userId })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
