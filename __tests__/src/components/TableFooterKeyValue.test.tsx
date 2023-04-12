import { render, screen } from '@testing-library/react'
import { TableFooterKeyValue } from '../../../src/components'
import '@testing-library/jest-dom'

describe('TableFooterKeyValue', () => {
  it('should render a key value', () => {
    render(<TableFooterKeyValue keyy="foo" value="bar" />)

    const tableFooterK = screen.getByText('foo')
    const tableFooterV = screen.getByText('bar')

    expect(tableFooterK).not.toBe(null)
    expect(tableFooterV).not.toBe(null)
  })
})
