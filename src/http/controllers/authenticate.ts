import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/src/use_cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/src/use_cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateUserBodySchema.parse(request.body)

  const authenticateUseCase = makeAuthenticateUseCase()

  try {
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      })
    }

    throw err
  }
}
