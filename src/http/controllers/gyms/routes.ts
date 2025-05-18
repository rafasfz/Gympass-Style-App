import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { create } from './create'
import { search } from './search'
import { nearby } from './nearby'
import { onlyAdmin } from '../../middlewares/only-admin'

async function onlyAdminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', onlyAdmin)
  app.post('/gyms', create)
}

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.register(onlyAdminRoutes)

  app.get('/gyms', search)
  app.get('/gyms/nearby', nearby)
}
