import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/src/app'
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user'
import { createGym } from '@/src/utils/test/create-gym'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { gym } = await createGym()

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: gym.latitude,
        longitude: gym.longitude,
      })

    expect(response.status).toBe(201)
  })
})
