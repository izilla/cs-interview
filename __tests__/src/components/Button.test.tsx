import { render, screen } from '@testing-library/react'
import { Button } from '../../../src/components'
import '@testing-library/jest-dom'

describe('Button', () => {
  it('renders a button', () => {
    const mockHandler = jest.fn()

    render(<Button text="Button" onClick={mockHandler} />)

    const button = screen.getByText('Button')

    button.click()

    expect(mockHandler).toBeCalled()
  })
})
