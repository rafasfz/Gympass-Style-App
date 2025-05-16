import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let sut: FetchNearbyGymsUseCase
let gymsRepository: InMemoryGymsRepository
const latitude = -27.2092052
const longitude = -49.6401091

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude,
      longitude,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

    const { gyms } = await sut.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Near Gym',
        }),
      ]),
    )
  })
})
