import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/src/app'
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const { user, token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name: user.name,
        email: user.email,
      }),
    })
  })
})
