import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let sut: RegisterUseCase
let usersRepository: InMemoryUsersRepository

describe('Register Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    const { user } = await sut.execute(userData)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    const { user } = await sut.execute(userData)

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not allow duplicate users', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    await sut.execute(userData)

    await expect(() => {
      return sut.execute(userData)
    }).rejects.toThrowError(InvalidCredentialsError)
  })
})
