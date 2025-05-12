import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from '@/src/lib/prisma'
import { SALT_ROUNDS } from '@/src/settings'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerUserBodySchema.parse(request.body)

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userAlreadyExists) {
    return reply.status(409).send()
  }

  const password_hash = await hash(password, SALT_ROUNDS)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return reply.status(201).send()
}
