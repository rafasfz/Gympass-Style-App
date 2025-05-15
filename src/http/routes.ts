import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJwt } from './middlewares/verify-jwt'

async function authenticatedRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.get('/me', profile)
}

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.register(authenticatedRoutes)
}
