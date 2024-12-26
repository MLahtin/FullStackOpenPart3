/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import personServices from './services/persons'
import './style.css'

const ShowPerson = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}{' '}
      <button onClick={() => handleDelete(person)}>Delete</button>
    </div>
  )
}

const FilterResults = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with
      <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const AddInformation = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <div>
      name: <input value={newName} onChange={handleNameChange} />
      <br />
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="notification">{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personServices.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const addNumber = (event) => {
    event.preventDefault()
    const existingName = persons.find((person) => person.name === newName)
    console.log(existingName)
    if (existingName) {
      if (
        window.confirm(
          `${newName} is already added to phonebook. Do you want to edit his number?`
        )
      ) {
        const numberObject = { name: existingName.name, number: newNumber }
        personServices
          .update(existingName.id, numberObject)
          .then(
            (newPersons) => setPersons(newPersons),
            setNotification(
              `Contact with ${existingName.name} edited successfully`
            )
          )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      }
      personServices.create(nameObject).then(
        (returnedPerson) => {
          setPersons(persons.concat(returnedPerson)),
            setNotification(`Added ${returnedPerson.name} successfully`)
        },
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      )
      setNewName('')
      setNewNumber('')
    }
  }
  const handleDelete = (person) => {
    if (window.confirm('Do you want to delete the person?')) {
      personServices
        .deleteItem(person.id)
        .then(setNotification(`Person ${person.name} deleted successfully`))
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const showRecord = showAll
    ? persons
    : persons.filter((person) => person.name.match(filter))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNumber}>
        <div>
          <FilterResults
            filter={filter}
            handleFilterChange={handleFilterChange}
          />
          <br />
          <h3>add new</h3>
          <Notification message={notification} />
          <AddInformation
            newName={newName}
            newNumber={newNumber}
            handleNameChange={handleNameChange}
            handleNumberChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      {showRecord.map((person) => (
        <>
          <ShowPerson
            key={person.id}
            person={person}
            handleDelete={handleDelete}
          />
        </>
      ))}
    </div>
  )
}

export default App
