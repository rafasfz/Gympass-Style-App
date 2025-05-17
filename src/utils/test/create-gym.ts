import { prisma } from '@/src/lib/prisma'

export async function createGym() {
  const gym = await prisma.gym.create({
    data: {
      title: 'JavaScript Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
    },
  })

  return { gym }
}
