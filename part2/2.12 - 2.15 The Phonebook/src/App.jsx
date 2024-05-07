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

  const updatePerson = async id => {
    try {
      const person = persons.find(p => p.id === id)
      const changedPerson = { ...person, number: newNumber }
      const updatedPerson = await personService.update(id, changedPerson)

      setPersons(persons.map(p => (p.id === id ? updatedPerson : p)))
    } catch (error) {
      console.log('Error updating person:', error)
    }
  }

  const addPerson = async e => {
    e.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson(existingPerson.id, newNumber)
        setNewName('')
        setNewNumber('')
        return
      }
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
      const personToDelete = persons.find(p => p.id === id)
      if (window.confirm(`Delete ${personToDelete.name}?`)) {
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
