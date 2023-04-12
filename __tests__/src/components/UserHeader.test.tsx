import { render, screen } from '@testing-library/react'
import { UserHeader } from '../../../src/components'
import '@testing-library/jest-dom'

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react')
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: 'admin' }
  }
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => ({ data: mockSession, status: 'authenticated' }))
  }
})

describe('UserHeader', () => {
  it('should render a row for a table', () => {
    render(<UserHeader route="foo" />)

    const header = screen.getByText('admin')
    const foo = screen.getByText('/ foo')

    expect(header).not.toBe(null)
    expect(foo).not.toBe(null)
  })
})
