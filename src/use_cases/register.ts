import { hash } from 'bcryptjs'
import { HASHING_SALT_ROUNDS } from '@/src/settings'
import { UsersRepository } from '@/src/repositories/users-repository'
import { UserAlereadyExistsError } from './errors/user-already-exists-error'
import { User } from '@/generated/prisma'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlereadyExistsError()
    }

    const password_hash = await hash(password, HASHING_SALT_ROUNDS)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
