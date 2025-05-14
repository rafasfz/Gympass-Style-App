import { Prisma, CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'
import { ITEMS_PER_PAGE } from '@/src/settings'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: 'check-in-id',
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return Promise.resolve(checkIn)
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return checkIns
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((item) => {
      const checkInDate = dayjs(item.created_at)
      const isSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)

      return item.user_id === userId && isSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }
}
