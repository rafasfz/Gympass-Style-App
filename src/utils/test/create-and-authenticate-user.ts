import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const user = {
    name: 'John Lennon',
    email: 'johnlennon@example.com',
    password: '123123',
  }

  await request(app.server)
    .post('/users')
    .send({ ...user })

  const authResponse = await request(app.server).post('/sessions').send({
    email: user.email,
    password: user.password,
  })

  const { token } = authResponse.body

  return {
    token,
    user,
  }
}
