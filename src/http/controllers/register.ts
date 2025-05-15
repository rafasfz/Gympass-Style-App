import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeRegisterUseCase } from '@/src/use_cases/factories/make-register-use-case'
import { GlobalHttpError } from '@/src/errors'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof GlobalHttpError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(201).send()
}
