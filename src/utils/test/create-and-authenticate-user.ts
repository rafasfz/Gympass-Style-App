import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const userData = {
    name: 'John Lennon',
    email: 'johnlennon@example.com',
    password: '123123',
  }

  const { user } = (
    await request(app.server)
      .post('/users')
      .send({ ...userData })
  ).body

  const authResponse = await request(app.server).post('/sessions').send({
    email: userData.email,
    password: userData.password,
  })

  const { token } = authResponse.body

  return {
    token,
    user,
  }
}
