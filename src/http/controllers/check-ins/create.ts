import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/src/use-cases/factories/make-check-in-use-case'
import {
  validateLongitude,
  valiteLatitude,
} from '@/src/utils/validations/coordinates'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().cuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine(valiteLatitude),
    longitude: z.coerce.number().refine(validateLongitude),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const userId = request.user.sub

  const createGymUseCase = makeCheckInUseCase()

  await createGymUseCase.execute({
    gymId,
    userId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
