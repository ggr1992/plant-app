const data = require('./data/development-data/data')

const arr = []

data.forEach((plant) => {
  plant.sunlight.forEach((value) => {
    arr.push(value.toLowerCase().trim())
  })
})

console.log([...new Set(arr)])