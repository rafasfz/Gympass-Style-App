import { prisma } from '@/src/lib/prisma'
import { HASHING_SALT_ROUNDS } from '@/src/settings'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: 'ADMIN' | 'MEMBER' = 'MEMBER',
) {
  const password = '123123'

  const userData = {
    name: 'John Lennon',
    email: 'johnlennon@example.com',
    password_hash: await hash(password, HASHING_SALT_ROUNDS),
    role,
  }

  const user = await prisma.user.create({
    data: userData,
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: userData.email,
    password,
  })

  const { token } = authResponse.body
  const cookies = authResponse.get('Set-Cookie') as string[]

  return {
    token,
    user,
    cookies,
  }
}
