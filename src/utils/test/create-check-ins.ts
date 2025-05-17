import { prisma } from '@/src/lib/prisma'

interface InputsCreateCheckIn {
  gymId: string
  userId: string
  length: number
}

export async function createCheckIns({
  gymId,
  userId,
  length,
}: InputsCreateCheckIn) {
  const checkInsData = Array.from({ length }, () => {
    return {
      gym_id: gymId,
      user_id: userId,
    }
  })

  await prisma.checkIn.createMany({
    data: checkInsData,
  })

  const checkIns = await prisma.checkIn.findMany({
    where: {
      user_id: userId,
      gym_id: gymId,
    },
  })

  return { checkIns }
}
