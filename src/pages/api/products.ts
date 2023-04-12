import { redisClient } from '@/utils'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new PrismaClient()
  const redis = await redisClient()

  try {
    if (req.method === 'POST') {
      const productData = JSON.parse(req.body || '')
      const result = await client.products.create({
        data: productData
      })

      if (result) {
        res.status(200).json(result)
        return
      } else {
        res.status(500).send('Error creating product')
        return
      }
    } else if (req.method === 'DELETE') {
      const productId = Number.parseInt(req.query['id'] as string)
      const result = await client.products.delete({
        where: {
          id: productId
        }
      })

      if (result) {
        res.status(200).json(result)
        await redis.del(`${productId}.product`)
        return
      } else {
        res.status(404).send('Nothting to delete')
        return
      }
    } else if (req.method === 'PUT') {
      const productData = JSON.parse(req.body || '')
      const response = await client.products.update({
        where: {
          id: productData.id
        },
        data: productData
      })

      res.status(200).json(response)
      redis.set(`${productData.id}.product`, JSON.stringify(response))
      return
    } else if (req.method === 'GET') {
      const { user } = await getServerSession(req, res, authOptions)

      if (!user) {
        res.status(401)
        return
      }

      const data = await client.users.findFirst({
        where: {
          id: user.id
        },
        skip: 10,
        include: {
          Products: {
            select: {
              id: true,
              brand: true,
              product_name: true,
              style: true,
              Inventory: {
                select: {
                  sku: true,
                  color: true
                }
              }
            }
          }
        }
      })

      res.status(200).json(data?.Products)
    }
  } catch (err: any) {
    console.error(err)
    res.status(500).send(err.message)
    return
  } finally {
    await client.$disconnect()
    await redis.quit()
  }
}

export default handler
