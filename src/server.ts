import { app } from './app'
import { HOST, PORT } from './settings'

app
  .listen({
    host: HOST,
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
  })
