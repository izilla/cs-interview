import { createClient } from 'redis'

const redisClient = async () => {
  const client = await createClient({
    socket: {
      host: process.env.REDIS_URL || 'localhost',
      port: Number.parseInt(process.env.REDIS_PORT || '30540')
    },
    password: process.env.REDIS_PASSWORD || 'password'
  })

  client.on('error', err => {
    throw new Error(err)
  })

  await client.connect()

  return client
}

export default redisClient
