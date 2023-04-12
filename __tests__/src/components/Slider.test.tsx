import { fireEvent, render, screen } from '@testing-library/react'
import { Slider } from '../../../src/components'
import '@testing-library/jest-dom'

describe('Slider', () => {
  it('should slide', () => {
    const mockHandler = jest.fn()

    render(<Slider value={0} onChange={mockHandler} />)

    const slider = screen.getByRole('slider')

    fireEvent.change(slider, { target: { value: 1 } })

    expect(mockHandler).toHaveBeenCalled()
  })
})
