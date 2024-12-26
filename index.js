const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

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

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: '1',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2',
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3',
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4',
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${date}`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find((person) => person.id === request.params.id)
  response.json(person)
})

const generateId = () => {
  const max = 1000
  const min = 3
  const id = Math.random() * (max - min) + min
  return String(id)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const existingName = persons.filter((person) => person.name === body.name)

  if (existingName.length > 0) {
    return response.status(400).json({
      error: 'Already existing name',
    })
  }
  if (!body.name) {
    return response.status(400).json({
      error: 'Name cannot be empty',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number cannot be empty',
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter((person) => persons.id === request.params.id)

  response.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
