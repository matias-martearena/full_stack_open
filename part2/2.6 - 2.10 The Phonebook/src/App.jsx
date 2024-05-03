import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '040-1234567' }])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = e => {
    e.preventDefault()

    if (persons.find(person => person.name === newName)) return alert(`${newName} is already added to phonebook`)

    const personObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = e => setNewName(e.target.value)
  const handleNumberChange = e => setNewNumber(e.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <fieldset>
          <legend>New contact:</legend>
          <article>
            <label>Name: </label>
            <input value={newName} onChange={handleNameChange}/>
          </article>
          <article>
            <label >Number:</label>
            <input value={newNumber} onChange={handleNumberChange}/>
          </article>
        </fieldset>
        <button type="submit">Add</button>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App
