import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@/generated/prisma/runtime/library'

let sut: CheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepostitory: InMemoryGymsRepository
const latitude = -27.2092052
const longitude = -49.6401091

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepostitory = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepostitory)
    gymsRepostitory.items.push({
      id: 'gym-id',
      title: 'Gym',
      description: '',
      phone: '',
      latitude: new Decimal(latitude),
      longitude: new Decimal(longitude),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice on the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 2, 9, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    await expect(() => {
      return sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: latitude,
        userLongitude: longitude,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check-in twice on different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 2, 9, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    vi.setSystemTime(new Date(2025, 0, 2, 2, 9, 0, 0))
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on distant gym', async () => {
    gymsRepostitory.items.push({
      id: 'gym-id-2',
      title: 'Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() => {
      return sut.execute({
        userId: 'user-id',
        gymId: 'gym-id-2',
        userLatitude: latitude,
        userLongitude: longitude,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
