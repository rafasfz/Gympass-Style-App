import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/src/use-cases/factories/make-fetch-nearby-gyms-use-case'
import {
  validateLongitude,
  valiteLatitude,
} from '@/src/utils/validations/coordinates'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySechma = z.object({
    latitude: z.coerce.number().refine(valiteLatitude),
    longitude: z.coerce.number().refine(validateLongitude),
  })

  const { latitude, longitude } = searchGymsQuerySechma.parse(request.query)

  const fetchNearbyGYmsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGYmsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
