import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUseCase } from '@/src/use_cases/register'
import { PrismaUsersRepository } from '@/src/repositories/prisma/prisma-users-repository'
import { InvalidCredentialsError } from '@/src/use_cases/errors/invalid-credentials-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  try {
    const prismaRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaRepository)

    await registerUseCase.execute({
      name,
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

  return reply.status(201).send()
}
