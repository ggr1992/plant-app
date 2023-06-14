export function capitalise(str) {
  let nameArr = str.split(' ')
  nameArr = nameArr.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  str = nameArr.join(' ')
  return str
}