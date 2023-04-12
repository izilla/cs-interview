import { redisClient } from '@/utils'
import { PrismaClient, Products } from '@prisma/client'
import { GetServerSideProps } from 'next'

import { Button, Table, TableRow, UserHeader } from '@/components'
import { ChangeEventHandler, MouseEventHandler, useState } from 'react'
import { useRouter } from 'next/router'

type ProductPageProps = {
  product: Products | null
}

const headers = ['Product Name', 'Style', 'Brand', 'Description']

type LabelProps = {
  htmlFor?: string
  children?: any
}

const Label = ({ htmlFor, children }: LabelProps) => (
  <label htmlFor={htmlFor} className="block mb-2 font-medium dark:text-slate-300 text-md">
    {children}
  </label>
)

type InputProps = {
  disabled?: boolean
  placeholder?: string
  value: string | number | undefined
  onChange: ChangeEventHandler<HTMLInputElement>
}

const Input = ({ disabled = false, placeholder = 'Type something', value, onChange }: InputProps) => (
  <input
    type="text"
    disabled={disabled}
    value={value}
    className="block p-2 w-full rounded-md font-medium text-sm text-gray-900 border dark:border-gray-600  dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:bg-gray-800"
    placeholder={placeholder}
    onChange={onChange}
  />
)

export const ProductPage = ({ product }: ProductPageProps) => {
  const [editMode, setEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isNewMode, setIsNewMode] = useState(false)
  const [productName, setProductName] = useState(product?.product_name)
  const [description, setDescription] = useState(product?.description)
  const [style, setStyle] = useState(product?.style)
  const [brand, setBrand] = useState(product?.brand)

  const router = useRouter()

  const handleProductNameChange: ChangeEventHandler<HTMLInputElement> = input => setProductName(input.target.value)
  const handleDescriptionChange: ChangeEventHandler<HTMLInputElement> = input => setDescription(input.target.value)
  const handleStyleChange: ChangeEventHandler<HTMLInputElement> = input => setStyle(input.target.value)
  const handleBrandChange: ChangeEventHandler<HTMLInputElement> = input => setBrand(input.target.value)

  const handleEditClick = () => {
    setEditMode(!editMode)

    if (!editMode) {
      setProductName(product?.product_name)
      setDescription(product?.description)
      setStyle(product?.style)
      setBrand(product?.brand)
    }
  }

  const handleSaveOrNewClick: MouseEventHandler<HTMLButtonElement> = async element => {
    const buttonText = (element.target as HTMLButtonElement).innerText

    if (buttonText === 'New') {
      setProductName('')
      setDescription('')
      setStyle('')
      setBrand('')
      setEditMode(true)
      setIsNewMode(true)
    } else if (buttonText === 'Save') {
      setIsSaving(true)
      if (!isNewMode) {
        await fetch('/api/products', {
          method: 'PUT',
          body: JSON.stringify({
            id: product?.id,
            product_name: productName,
            description: description,
            style,
            brand
          })
        })
        router.replace(router.asPath)
      } else {
        const newResponse = await fetch('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            product_name: productName,
            description: description,
            style,
            brand
          })
        }).then(res => res.json())

        router.replace(`/products/${newResponse.id}`)
      }
      setEditMode(false)
      setIsSaving(false)
    }
  }

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = async element => {
    const result = await fetch(`/api/products?id=${product?.id}`, {
      method: 'DELETE'
    })

    if (result) {
      router.push('/products')
    } else {
      alert('Could not delete: ' + result)
    }
  }

  if (!product) return <div>Product not found</div>

  const rowData = [product.product_name, product.style, product.brand, product.description]

  return (
    <div className="m-4">
      <UserHeader route={['products', '' + product.id]} />
      <div className="m-4 p-4">
        {editMode ? (
          <form className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input disabled={isSaving} value={productName} onChange={handleProductNameChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input disabled={isSaving} value={description} onChange={handleDescriptionChange} />
            </div>
            <div>
              <Label htmlFor="style">Style</Label>
              <Input disabled={isSaving} value={style} onChange={handleStyleChange} />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input disabled={isSaving} value={brand} onChange={handleBrandChange} />
            </div>
          </form>
        ) : (
          <Table headers={headers}>
            <TableRow data={rowData} />
          </Table>
        )}
        <div className="mt-8 flex flex-row gap-4 justify-end">
          <Button text={editMode ? 'Cancel' : 'Edit'} onClick={handleEditClick} />
          <Button text={editMode ? 'Save' : 'New'} onClick={handleSaveOrNewClick} />
          <Button text="Delete" onClick={handleDeleteClick} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const client = new PrismaClient()
  const redis = await redisClient()
  const productId = context?.params?.id as string

  const ignoreCache = Boolean(context.query['ignoreCache'])

  if (!productId) {
    return { props: {} }
  }
  const redisKey = `${productId}.product`

  try {
    const cachedResult = ignoreCache ? null : await redis.get(redisKey)

    if (cachedResult) {
      return {
        props: {
          product: JSON.parse(cachedResult)
        }
      }
    }

    const product = await client.products.findFirst({
      where: {
        id: Number.parseInt(context?.params?.id as string)
      }
    })

    if (!product) throw new Error('No product found whose id is: ' + context?.params?.id)

    await redis.set(redisKey, JSON.stringify(product))

    return {
      props: {
        product: JSON.parse(JSON.stringify(product))
      }
    }
  } catch (error) {
    console.error(error)
    return {
      props: {}
    }
  } finally {
    await client.$disconnect()
    await redis.disconnect()
  }
}

export default ProductPage
