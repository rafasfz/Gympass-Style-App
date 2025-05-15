import { env } from '@/src/env'

export const ITEMS_PER_PAGE = 20

export const MAX_DISTANCE_TO_CHECK_IN_IN_METERS = 100
export const GYM_NEARBY_IN_METERS = 10000

export const MAX_TIME_TO_VALITE_CHECK_INS_IN_MINUTES = 20

export const PORT = env.PORT
export const HOST = '0.0.0.0'

export const HASHING_SALT_ROUNDS = 6

export const SECRET_KEY = env.SECRET_KEY
