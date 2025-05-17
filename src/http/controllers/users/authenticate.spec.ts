import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/src/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const user = {
      name: 'John Lennon',
      email: 'johnlennon@example.com',
      password: '123123',
    }

    await request(app.server)
      .post('/users')
      .send({ ...user })

    const response = await request(app.server).post('/sessions').send({
      email: user.email,
      password: user.password,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
