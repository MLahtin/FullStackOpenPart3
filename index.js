/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
morgan.token('req-body', function getBody(req) {
  return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(cors())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
)
app.use(express.json())

app.get('/api/persons', (request, response) => {
  Number.find({}).then((numbers) => {
    response.json(numbers)
  })
})

app.get('/info', (request, response) => {
  const date = Date()
  Number.find({}).then((numbers) => {
    response.send(`Phonebook has info for ${numbers.length} <br/> ${date}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Number.findById(request.params.id)
    .then((number) => {
      response.json(number)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const record = new Number({
    name: body.name,
    number: body.number,
  })

  record
    .save()
    .then((savedNumber) => {
      response.json(savedNumber)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Number.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidator: true, context: 'query' }
  )
    .then((updatedNumber) => {
      response.json(updatedNumber)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Number.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(errorHandler)
