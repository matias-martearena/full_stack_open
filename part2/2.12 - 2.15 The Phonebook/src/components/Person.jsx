const Person = ({ filter, deletePerson }) => {
  return (
    <section>
      <h2>Numbers</h2>
      {filter.map(person => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </p>
      ))}
    </section>
  )
}

export default Person
