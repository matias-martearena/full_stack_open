const CountriesList = ({ name, countriesFilter }) => {
  if (!countriesFilter) return null

  if (name.length === 0) {
    return (
      <p>Please enter a filter</p>
    )
  }

  if (countriesFilter.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (countriesFilter.length <= 10 && countriesFilter.length >= 2) {
    return (
      countriesFilter.map(c => <p key={c.name.official}>{c.name.official}</p>)
    )
  }

  if (countriesFilter.length === 1) {
    return (
      countriesFilter.map(c =>
        <div key={c.name.official}>
          <h2>{c.name.official}</h2>
          <p><strong>Common name: </strong>{c.name.common}</p>
          <p>Capital: {c.capital[0]}</p>
          <p>Area: {c.area}</p>
          <h3>Languages:</h3>
          <ul>
            {Object.entries(c.languages).map(([clave, valor]) => (
              <li key={clave}>{valor}</li>
            ))}
          </ul>
          <img src={c.flags.png} alt={`Flag of ${c.name.official}`} />
        </div>
      )
    )
  }
}

export default CountriesList
