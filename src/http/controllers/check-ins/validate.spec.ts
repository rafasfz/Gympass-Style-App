import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/src/app'
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user'
import { createGym } from '@/src/utils/test/create-gym'
import { createCheckIns } from '@/src/utils/test/create-check-ins'
import { prisma } from '@/src/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token, user } = await createAndAuthenticateUser(app, 'ADMIN')

    const { gym } = await createGym()

    const { checkIns } = await createCheckIns({
      userId: user.id,
      gymId: gym.id,
      length: 1,
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIns[0].id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(204)

    const checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIns[0].id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
