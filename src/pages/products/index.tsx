import { Inventory, PrismaClient, Products } from '@prisma/client'

import { Button, Table, TableFooter, TableRow, UserHeader } from '@/components'
import { GetServerSideProps } from 'next'
import { redisClient } from '@/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import { MouseEventHandler, useState } from 'react'

type ProductsWithInventory = {
  Inventory: Inventory[]
} & Products

export const ProductsPage = ({ data: products }: { data: ProductsWithInventory[] }) => {
  const router = useRouter()
  const [moreProducts, setMoreProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMoreClick: MouseEventHandler<HTMLButtonElement> = async button => {
    setIsLoading(true)
    const more = await fetch('/api/products').then(res => res.json())

    setMoreProducts(more)
    setIsLoading(false)
  }

  return (
    <div className="m-4">
      <UserHeader route="Products" />
      <div className="my-4">
        <Table headers={['Product Name', 'Style', 'Brand', 'SKUs']}>
          {products?.concat(moreProducts).map(product => {
            const rowData = [
              product.product_name,
              product.style,
              product.brand,
              product.Inventory.reduce((acc: string[], cur) => acc.concat(cur.sku), []).join(', ')
            ]
            return (
              <TableRow
                key={product.id}
                data={rowData}
                clickable
                onClick={_ => router.push(`/products/${product.id}`)}
              />
            )
          })}
        </Table>
        <TableFooter>
          <p className="text-sm">
            <Button text={isLoading ? '...' : 'Load More'} onClick={handleLoadMoreClick} />
          </p>
        </TableFooter>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const client = new PrismaClient()
  const redis = await redisClient()
  const { req, res } = context

  const ignoreCache = Boolean(context.query['ignoreCache'])

  const nullProps = {
    props: null
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.email) {
      return nullProps
    }

    const redisKey = `${session?.user?.email}.products`
    const cachedUser = ignoreCache ? null : await redis.get(redisKey)

    if (cachedUser) {
      return {
        props: JSON.parse(cachedUser)
      }
    }

    const user = await client.users.findFirst({
      where: {
        email: session?.user?.email
      },
      include: {
        Products: {
          select: {
            id: true,
            product_name: true,
            style: true,
            brand: true,
            Inventory: {
              select: {
                id: true,
                sku: true
              }
            }
          },
          take: 10
        }
      }
    })

    if (user == null) {
      return nullProps
    }

    const response = {
      data: JSON.parse(JSON.stringify(user?.Products))
    }
    await redis.set(redisKey, JSON.stringify(response))

    return {
      props: response
    }
  } catch (error) {
    console.error(error)
    return nullProps
  } finally {
    await client.$disconnect()
    await redis.disconnect()
  }
}

export default ProductsPage
