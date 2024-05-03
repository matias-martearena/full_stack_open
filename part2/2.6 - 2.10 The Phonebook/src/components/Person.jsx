const Person = ({ filter }) => {
  return (
    <section>
      <h2>Numbers</h2>
      {filter.map(person => (
        <p key={person.id}>{person.name} {person.number}</p>
      ))}
    </section>
  )
}

export default Person
