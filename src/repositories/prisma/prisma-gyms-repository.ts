import { Gym, Prisma } from '@/generated/prisma'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/src/lib/prisma'
import { GYM_NEARBY_IN_METERS, ITEMS_PER_PAGE } from '@/src/settings'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = prisma.gym.create({
      data,
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (page - 1),
    })

    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= (${GYM_NEARBY_IN_METERS / 1000})
    `

    return gyms
  }
}
