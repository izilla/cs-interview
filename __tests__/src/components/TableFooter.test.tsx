import { render, screen } from '@testing-library/react'
import { TableFooter } from '../../../src/components'
import '@testing-library/jest-dom'

describe('TableFooter', () => {
  it('should display footer data', () => {
    render(<TableFooter>Foo</TableFooter>)

    const tableFooter = screen.getAllByRole('navigation')

    expect(tableFooter).not.toBe(null)
  })
})
