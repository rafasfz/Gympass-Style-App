import { Prisma, PrismaClient } from '@/generated/prisma'
import { env } from '@/src/env'

const log: Array<Prisma.LogLevel> = env.NODE_ENV === 'dev' ? ['query'] : []

export const prisma = new PrismaClient({
  log,
})
