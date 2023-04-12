export const convertMapToObject = (map: Map<string, number>) => {
  const obj: { [k: string]: number } = {}
  for (let prop of map) {
    obj[prop[0]] = prop[1]
  }
  return obj
}

export default convertMapToObject
