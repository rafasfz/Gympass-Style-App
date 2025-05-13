import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthenticateUseCase } from '@/src/use_cases/authenticate'
import { PrismaUsersRepository } from '@/src/repositories/prisma/prisma-users-repository'
import { InvalidCredentialsError } from '@/src/use_cases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateUserBodySchema.parse(request.body)

  try {
    const prismaRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(prismaRepository)

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(200).send()
}
