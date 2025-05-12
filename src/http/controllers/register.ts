import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUseCase } from '@/src/use_cases/register'
import { PrismaUsersRepository } from '@/src/repositories/prisma/prisma-users-repository'
import { UserAlereadyExistsError } from '@/src/use_cases/errors/user-already-exists-error'

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
    if (err instanceof UserAlereadyExistsError) {
      return reply.status(409).send({
        message: 'User already exists.',
      })
    }

    throw err
  }

  return reply.status(201).send()
}
