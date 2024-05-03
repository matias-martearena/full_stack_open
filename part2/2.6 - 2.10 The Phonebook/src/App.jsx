import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [findName, setFindName] = useState('')

  const addPerson = e => {
    e.preventDefault()

    if (persons.find(person => person.name === newName)) return alert(`${newName} is already added to phonebook`)

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }

    setPersons([...persons, personObject])
    setNewName('')
    setNewNumber('')
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
      <Person filter={filteredPersons}/>
    </div>
  )
}

export default App
