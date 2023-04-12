import { Inventory, Orders, PrismaClient, Products, Users } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { convertMapToObject, priceFormatter, redisClient } from '@/utils'
import { ChangeEventHandler, MouseEventHandler, useState } from 'react'
import { Button, Table, TableFooter, TableFooterKeyValue, TableRow, UserHeader } from '@/components'

type UserWithProductsAndOrdersAndInventory =
  | (Users & {
      Products: (Products & {
        Orders: (Orders & {
          inventory: Inventory | null
        })[]
      })[]
    })
  | null

type OrdersPageProps = {
  data: UserWithProductsAndOrdersAndInventory
}

export const OrdersPage = ({ data }: OrdersPageProps) => {
  const [productIdFilter, setProductIdFilter] = useState('')
  const [skuFilter, setSkuFilter] = useState('')
  const [groupChecked, setGroupChecked] = useState(false)

  const [moreOrder, setMoreOrder] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const allOrders = data?.Products.concat(moreOrder).reduce((acc: Orders[], cur) => acc.concat([...cur.Orders]), [])
  const totalSales = allOrders?.reduce((acc, cur) => acc + (cur?.total_cents || 0), 0)

  const handleProductIdFilterChange: ChangeEventHandler<HTMLInputElement> = input => {
    setProductIdFilter(input.target.value)
  }

  const handleSkuFilterChange: ChangeEventHandler<HTMLInputElement> = input => {
    setSkuFilter(input.target.value)
  }

  const handleGroupChange: ChangeEventHandler<HTMLInputElement> = input => {
    setGroupChecked(input.target.checked)
  }

  const handleLoadMoreClick: MouseEventHandler<HTMLButtonElement> = async button => {
    setIsLoading(true)
    const orders = await fetch('/api/orders').then(res => res.json())

    setMoreOrder(orders)
    setIsLoading(false)
  }

  const headers = [
    'Customer Name',
    'Email',
    'Product Name',
    'Color',
    'Size',
    'Status',
    'Order Total',
    'Transaction Id',
    'Shipper',
    'Tracking Number'
  ]

  const filteredOrders =
    ((productIdFilter || skuFilter) &&
      data?.Products.concat(moreOrder)
        .filter(product => product.id.toString().includes(productIdFilter))
        .reduce(
          (acc: any[], cur) => acc.concat([...cur.Orders.filter(order => order?.inventory?.sku.includes(skuFilter))]),
          []
        )) ||
    allOrders
  const filteredSales = filteredOrders?.reduce((acc, cur) => acc + (cur?.total_cents || 0), 0)

  const groupedStatusValues =
    (groupChecked &&
      filteredOrders?.reduce(
        (acc, cur) =>
          acc.get(cur.order_status)
            ? acc.set(cur.order_status, (acc.get(cur.order_status) || 0) + 1)
            : acc.set(cur.order_status, 1),
        new Map<string, number>()
      )) ||
    new Map<string, number>()

  const groupedStatusValuesArray = convertMapToObject(groupedStatusValues)

  return (
    <div className="m-8">
      <UserHeader route={'Orders'} />
      <div className="my-4">
        <label className="my-2 flex flex-row gap-2">
          <input type="checkbox" onChange={handleGroupChange} />
          Group by Status
        </label>
      </div>
      <div className="my-4 flex flex-col gap-4">
        <div className="flex flex-row">
          <div className="w-36">Product Id:</div>
          <input className="w-full" type="text" onChange={handleProductIdFilterChange}></input>
        </div>
        <div className="flex flex-row">
          <div className="w-36">Sku:</div>
          <input className="w-full" type="text" onChange={handleSkuFilterChange}></input>
        </div>
      </div>
      <Table headers={headers}>
        {data?.Products?.concat(moreOrder).map((product, i) => {
          if (productIdFilter && !product.id.toString().includes(productIdFilter)) return null

          return (
            <>
              {product.Orders.map(order => {
                if (skuFilter && !order?.inventory?.sku.includes(skuFilter)) return null

                const rowData: string[] = [
                  order.name || 'N/A',
                  order.email || 'N/A',
                  product.product_name,
                  order?.inventory?.color || '',
                  order?.inventory?.size || '',
                  order.order_status || 'unknown',
                  priceFormatter(order?.total_cents || 0),
                  order.transaction_id || 'N/A',
                  order.shipper_name || 'N/A',
                  order.tracking_number || 'N/A'
                ]
                return <TableRow key={`${i}.${product.id}.${order.id}.${order.inventory_id}`} data={rowData} />
              })}
            </>
          )
        })}
      </Table>
      <TableFooter>
        <TableFooterKeyValue keyy="Showing:" value={`${filteredOrders?.length || 0} of ${allOrders?.length}`} />
        {groupChecked && (
          <p className="text-sm px-4">
            <span className="font-semibold text-gray-900 dark:text-white">
              <>
                {Object.keys(groupedStatusValuesArray)
                  .map(key => `${key}: ${groupedStatusValuesArray[key]}`)
                  .join(' ')}
              </>
            </span>
          </p>
        )}
        <div className="flex flex-row justify-center my-auto items-center gap-4">
          <Button text={isLoading ? '...' : 'Load More'} onClick={handleLoadMoreClick} />
          <TableFooterKeyValue
            keyy="Total sales:"
            value={`${filteredOrders ? `${priceFormatter(filteredSales)} of ` : ''}
          ${priceFormatter(totalSales || 0)}`}
          />
        </div>
      </TableFooter>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const client = new PrismaClient()
  const { user } = await getServerSession(context.req, context.res, authOptions)

  try {
    const data: UserWithProductsAndOrdersAndInventory = await client.users
      .findFirst({
        where: {
          email: user?.email
        },
        select: {
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
            },
            take: 10
          }
        }
      })
      .then(value => JSON.parse(JSON.stringify(value)))

    if (!data) throw new Error('Orders not found for user ' + user.id)

    return {
      props: {
        data
      }
    }
  } catch (error) {
    return { props: {} }
  } finally {
    await client.$disconnect()
  }
}

export default OrdersPage
