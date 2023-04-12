import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new PrismaClient()

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user) {
      res.status(401)
      return null
    }

    const order = await client.users
      .findFirst({
        where: {
          id: session.user.id
        },
        include: {
          Products: {
            select: {
              id: true,
              product_name: true,
              style: true,
              Orders: {
                select: {
                  id: true,
                  inventory_id: true,
                  name: true,
                  email: true,
                  order_status: true,
                  total_cents: true,
                  transaction_id: true,
                  shipper_name: true,
                  tracking_number: true,
                  inventory: {
                    select: {
                      color: true,
                      size: true,
                      sku: true
                    }
                  }
                }
              }
            }
          }
        },
        skip: 10
      })
      .then(value => JSON.parse(JSON.stringify(value?.Products)))

    if (!order) {
      res.status(404)
      return null
    }

    res.status(200).json(order)
  } catch (err: any) {
    res.status(500).send(err)
    return null
  } finally {
    client.$disconnect()
  }
}

export default handler
