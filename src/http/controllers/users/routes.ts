import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

async function authenticatedRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.get('/me', profile)
}

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)
  app.register(authenticatedRoutes)
}
