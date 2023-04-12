import { convertMapToObject } from '@/utils'

describe('convertMapToObject', () => {
  it('should convert a map to a keyed object', () => {
    const map = new Map<string, number>()
    map.set('foo', 1)
    map.set('bar', 2)

    const result = convertMapToObject(map)

    expect(result).toEqual({
      foo: 1,
      bar: 2
    })
  })
})
