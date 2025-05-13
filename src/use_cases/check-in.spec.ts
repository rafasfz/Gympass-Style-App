import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'

let sut: CheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to register', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice on the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 2, 9, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    })

    await expect(() => {
      return sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check-in twice on different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 2, 9, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    })

    vi.setSystemTime(new Date(2025, 0, 2, 2, 9, 0, 0))
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
