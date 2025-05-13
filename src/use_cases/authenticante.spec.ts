import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { HASHING_SALT_ROUNDS } from '../settings'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let sut: AuthenticateUseCase
let usersRepository: InMemoryUsersRepository
let userDataToRegister: {
  name: string
  email: string
  password_hash: string
}
let password: string

describe('Authenticate Use Case', async () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
    password = '123456'
    userDataToRegister = {
      name: 'John Doe',
      email: 'john@doe.com',
      password_hash: await hash(password, HASHING_SALT_ROUNDS),
    }
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create(userDataToRegister)

    const { user } = await sut.execute({
      email: userDataToRegister.email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(() => {
      return sut.execute({
        email: userDataToRegister.email,
        password,
      })
    }).rejects.toThrowError(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create(userDataToRegister)

    expect(() => {
      return sut.execute({
        email: userDataToRegister.email,
        password: 'wrong-password',
      })
    }).rejects.toThrowError(InvalidCredentialsError)
  })
})
