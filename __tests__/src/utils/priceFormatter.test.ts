import { priceFormatter } from '@/utils'

describe('priceFormatter', () => {
  it('should format prices', () => {
    const bogusData = 1999

    const result = priceFormatter(bogusData)

    expect(result).toBe('$19.99')
  })
})
