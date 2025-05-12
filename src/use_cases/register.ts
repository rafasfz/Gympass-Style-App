import { prisma } from '@/src/lib/prisma'
import { hash } from 'bcryptjs'
import { SALT_ROUNDS } from '../settings'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userAlreadyExists) {
    throw new Error('User already exists.')
  }

  const password_hash = await hash(password, SALT_ROUNDS)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
