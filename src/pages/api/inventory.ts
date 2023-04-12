import { Inventory, PrismaClient, Products } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new PrismaClient()

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user) {
      res.status(401)
      return
    }

    const inventory = await client.users.findFirstOrThrow({
      where: {
        id: session.user.id
      },
      include: {
        Products: {
          select: {
            id: true,
            product_name: true,
            Inventory: {
              select: {
                id: true,
                sku: true,
                quantity: true,
                color: true,
                size: true,
                price_cents: true,
                cost_cents: true
              }
            }
          }
        }
      },
      skip: 10
    })

    if (!inventory) {
      res.status(404)
      return
    }

    res.status(200).json({
      data: inventory.Products
    })
  } catch (err: any) {
    res.status(500).send(err)
  } finally {
    client.$disconnect()
  }
}

export default handler
