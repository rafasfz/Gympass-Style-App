import { FastifyReply, FastifyRequest } from 'fastify'

export async function onlyAdmin(request: FastifyRequest, reply: FastifyReply) {
  const { role } = request.user

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' })
  }
}
