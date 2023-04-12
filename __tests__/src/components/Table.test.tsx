import { render, screen } from '@testing-library/react'
import { Table } from '../../../src/components'
import '@testing-library/jest-dom'

describe('Table', () => {
  it('should display tabulated data', () => {
    render(
      <Table headers={['foo', 'bar']}>
        <tr>
          <td>Baz</td>
          <td>Gah</td>
        </tr>
      </Table>
    )

    const table = screen.getAllByRole('table')

    expect(table).not.toBe(null)
  })
})
