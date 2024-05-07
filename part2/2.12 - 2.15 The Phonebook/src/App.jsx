import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [findName, setFindName] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

  const addPerson = async e => {
    e.preventDefault()

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    try {
      const returnedPerson = await personService.create(personObject)
      setPersons([...persons, returnedPerson])
      setNewName('')
      setNewNumber('')
    } catch (error) {
      console.log('Error adding person:', error)
    }
  }

  const deletePerson = async id => {
    try {
      if (window.confirm(`Are you sure you want to delete person with ID ${id}?`)) {
        await personService.deletePerson(id)
        setPersons(persons.filter(person => person.id !== id))
      }
    } catch (error) {
      console.log('Error deleted person:', error)
    }
  }

  const handleFindName = e => setFindName(e.target.value)
  const handleNameChange = e => setNewName(e.target.value)
  const handleNumberChange = e => setNewNumber(e.target.value)

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(findName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={findName} onFindName={handleFindName} />
      <PersonForm
        onSubmitForm={addPerson}
        name={newName}
        onChageName={handleNameChange}
        number={newNumber}
        onChangeNumber={handleNumberChange}
      />
      <Person
        filter={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
