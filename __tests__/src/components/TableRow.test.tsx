import { render, screen } from '@testing-library/react'
import { TableRow } from '../../../src/components'
import '@testing-library/jest-dom'

describe('TableRow', () => {
  it('should render a row for a table', () => {
    const mockHandler = jest.fn()

    render(
      <table>
        <tbody>
          <TableRow data={['foo']} clickable onClick={mockHandler} />
        </tbody>
      </table>
    )

    const row = screen.getByText('foo')

    expect(row).not.toBe(null)

    row.click()

    expect(mockHandler).toBeCalled()
  })
})
