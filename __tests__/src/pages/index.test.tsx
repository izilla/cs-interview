import { render, screen } from '@testing-library/react'
import Home from '../../../src/pages'
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

describe('index', () => {
  it('should render', () => {
    render(<Home />)

    expect(screen.getAllByText('Portal')).toBeDefined()
  })
})
