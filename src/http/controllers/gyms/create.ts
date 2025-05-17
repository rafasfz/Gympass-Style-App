import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/src/use-cases/factories/make-create-gym-use-case'
import {
  validateLongitude,
  valiteLatitude,
} from '@/src/utils/validations/coordinates'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string().min(3).trim(),
    description: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    latitude: z.number().refine(valiteLatitude),
    longitude: z.number().refine(validateLongitude),
  })

  const { title, description, latitude, longitude, phone } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  const { gym } = await createGymUseCase.execute({
    title,
    description: description ?? null,
    latitude,
    longitude,
    phone: phone ?? null,
  })

  return reply.status(201).send({ gym })
}
