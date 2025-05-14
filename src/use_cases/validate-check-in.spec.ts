import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES } from '../settings'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let sut: ValidateCheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository

describe('Validate Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate inexistent check-in', async () => {
    await expect(() => {
      return sut.execute({
        checkInId: 'inexistent-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it(`should not be able to validate the check-in after ${MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES} minutes of its creation`, async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    })

    vi.advanceTimersByTime(
      1000 * 60 * (MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES + 1),
    )

    await expect(() => {
      return sut.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
