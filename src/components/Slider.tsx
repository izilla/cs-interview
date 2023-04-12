import { ChangeEventHandler } from 'react'

type SliderProps = {
  max?: string | number
  min?: string | number
  step?: string | number
  value: number
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Slider = ({ max = '100', min = '0', step = '1', value, onChange }: SliderProps) => (
  <input
    id="steps-range"
    className="w-full h-3 range-lg bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 m-auto"
    type="range"
    min={min}
    max={max}
    value={value}
    step={step}
    onChange={onChange}
  />
)

export default Slider
