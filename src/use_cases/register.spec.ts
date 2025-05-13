import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlereadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    const { user } = await registerUseCase.execute(userData)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    const { user } = await registerUseCase.execute(userData)

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not allow duplicate users', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    await registerUseCase.execute(userData)

    expect(() => {
      return registerUseCase.execute(userData)
    }).rejects.toThrowError(UserAlereadyExistsError)
  })
})
