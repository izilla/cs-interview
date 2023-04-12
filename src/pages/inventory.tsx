import { Button, Slider, Table, TableFooter, TableRow, UserHeader } from '@/components'
import { priceFormatter } from '@/utils'
import { Inventory, PrismaClient, Products } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { authOptions } from './api/auth/[...nextauth]'

type ProductsWithInventory = {
  Inventory: Inventory[]
} & Products

type InventoryPageProps = {
  inventory: ProductsWithInventory[]
}

const tableHeaders = ['Product Name', 'SKU', 'Quantity', 'Color', 'Size', 'Price', 'Cost']

const rowDataForItem = (product: Products, inventory: Inventory) => [
  product.product_name,
  inventory.sku,
  inventory.quantity,
  inventory.color,
  inventory.size,
  priceFormatter(inventory.price_cents),
  priceFormatter(inventory.cost_cents)
]

export const InventoryPage = ({ inventory }: InventoryPageProps) => {
  const [productIdFilter, setProductIdFilter] = useState('')
  const [skuFilter, setSkuFilter] = useState('')

  const [moreInventory, setMoreInventory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [inventoryThreshold, setInventoryThreshold] = useState(0)

  const handleProductIdFilterChange: ChangeEventHandler<HTMLInputElement> = input => {
    setProductIdFilter(input.target.value)
  }
  const handleSkuFilterChange: ChangeEventHandler<HTMLInputElement> = input => {
    setSkuFilter(input.target.value)
  }
  const handleInventoryThresholdChange: ChangeEventHandler<HTMLInputElement> = input => {
    setInventoryThreshold(input.target.valueAsNumber)
  }
  const maxInventory = inventory.concat(moreInventory).reduce((acc: number, cur: ProductsWithInventory) => {
    const mawQ = cur.Inventory.reduce((a: number, c: Inventory) => (c.quantity > a ? c.quantity : a), 0)
    return mawQ > acc ? mawQ : acc
  }, 0)

  const handleLoadMoreClick: MouseEventHandler<HTMLButtonElement> = async button => {
    setIsLoading(true)
    const data = await fetch('/api/inventory').then(res => res.json())

    setMoreInventory(data.data)
    setIsLoading(false)
  }

  return (
    <div className="max-h-[100vh] p-8">
      <UserHeader route="Inventory" />
      <div
        style={{
          alignItems: 'center',
          minHeight: '100vh',
          marginTop: '2em',
          maxHeight: '100%',
          position: 'relative'
        }}>
        <Table headers={tableHeaders}>
          {inventory.concat(moreInventory).map(product => {
            const filteredInventory = product.Inventory.filter(inv => skuFilter !== '' && inv.sku.includes(skuFilter))

            if (
              (productIdFilter && !('' + product.id).includes(productIdFilter)) ||
              (skuFilter && filteredInventory.length === 0)
            ) {
              return null
            }

            return (skuFilter ? filteredInventory : product.Inventory).map(inv => {
              if (skuFilter && !inv.sku.includes(skuFilter)) {
                return null
              }

              if (inventoryThreshold && !(inv.quantity >= inventoryThreshold)) {
                return null
              }

              return <TableRow key={`${product.id},${inv.id}`} data={rowDataForItem(product, inv)} />
            })
          })}
        </Table>
        <TableFooter>
          <div className="flex flex-row gap-4">
            <div className="w-28 h-[100%] m-auto">Product Id</div>
            <input
              className="w-full rounded-md px-2 py-1"
              type="text"
              name="filter"
              onChange={handleProductIdFilterChange}
            />
            <div className="w-8 h-[100%] m-auto">SKU</div>
            <input className="w-full rounded-md px-2 py-1" type="text" name="filter" onChange={handleSkuFilterChange} />
          </div>

          <div className="flex flex-row gap-4 h-[100%] my-auto items-center">
            <Button text={isLoading ? '...' : 'Load More'} onClick={handleLoadMoreClick} />
            <label htmlFor="steps-range" className="block text-sm font-medium w-24 text-gray-900 dark:text-white">
              Qty ({inventoryThreshold})
            </label>
            <Slider
              min="0"
              step={1}
              max={maxInventory}
              value={inventoryThreshold}
              onChange={handleInventoryThresholdChange}
            />
          </div>
        </TableFooter>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const client = new PrismaClient()
  const { req, res } = context
  const nullProps = {
    props: []
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user) {
      return nullProps
    }

    const inventory = await client.users.findFirstOrThrow({
      where: {
        email: session.user.email
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
          },
          take: 10
        }
      }
    })

    if (!inventory) {
      return nullProps
    }

    return {
      props: {
        inventory: JSON.parse(JSON.stringify(inventory.Products))
      }
    }
  } catch (error) {
    return nullProps
  } finally {
    client.$disconnect()
  }
}

export default InventoryPage
