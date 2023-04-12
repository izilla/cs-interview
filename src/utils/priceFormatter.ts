const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const priceFormatter = (priceInCents: number) => formatter.format(priceInCents / 100)

export default priceFormatter
