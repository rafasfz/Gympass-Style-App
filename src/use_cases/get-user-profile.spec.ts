import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { HASHING_SALT_ROUNDS } from '../settings'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let sut: GetUserProfileUseCase
let usersRepository: InMemoryUsersRepository
let userDataToRegister: {
  name: string
  email: string
  password_hash: string
}
let password: string

describe('Get User Profile Use Case', async () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
    password = '123456'
    userDataToRegister = {
      name: 'John Doe',
      email: 'john@doe.com',
      password_hash: await hash(password, HASHING_SALT_ROUNDS),
    }
  })

  it('should be able to get a user profile', async () => {
    const userId = (await usersRepository.create(userDataToRegister)).id

    const { user } = await sut.execute({ userId })

    expect(user.id).toEqual(userId)
    expect(user.name).toEqual(userDataToRegister.name)
  })

  it('should not be able to get a user profile with wrong id', async () => {
    expect(() => {
      return sut.execute({
        userId: 'non-existing-id',
      })
    }).rejects.toThrowError(ResourceNotFoundError)
  })
})
