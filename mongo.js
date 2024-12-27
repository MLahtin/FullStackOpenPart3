const mongoose = require('mongoose')
const { stringify } = require('querystring')

if (process.argv.length > 5) {
  console.log(
    'Too many arguments. Required arguments are: password, name, and number'
  )
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@fullstackopen.zrito.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullstackOpen`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

if (!process.argv[3]) {
  console.log('phonebook: ')
  Number.find({}).then((result) => {
    result.forEach((number) => {
      console.log(`${number.name} ${number.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const number = new Number({
    name: process.argv[3],
    number: process.argv[4],
  })

  number.save().then((result) => {
    console.log(`Added ${number.name} number: ${number.number} to phonebook `)
    mongoose.connection.close()
  })
}
