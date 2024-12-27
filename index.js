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
  }

  if (error.name === 'UnknownEndpoint') {
    return response.status(400).send({ error: 'Unknown endpoint' })
  }
  next(error)
}

app.use(express.static('dist'))
app.use(cors())
morgan.token('req-body', function getBody(req) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
)
app.use(express.json())
app.use(errorHandler)

let persons = []

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

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'Fields cannot be empty' })
  }

  const record = new Number({
    name: body.name,
    number: body.number,
  })

  record.save().then((savedNumber) => {
    response.json(savedNumber)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const number = {
    name: body.name,
    number: body.number,
  }

  Number.findByIdAndUpdate(request.params.id, number, { new: true })
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
