import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { registerUseCase } from '@/src/use_cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  try {
    await registerUseCase({
      name,
      email,
      password,
    })
  } catch (err) { 
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
