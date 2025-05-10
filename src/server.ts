import { app } from './app'
import { env } from './env'

const PORT = env.PORT
const HOST = '0.0.0.0'

app
  .listen({
    host: HOST,
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
  })
