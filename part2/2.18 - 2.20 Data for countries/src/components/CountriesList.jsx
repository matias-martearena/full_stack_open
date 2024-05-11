const CountrySummary = ({ country, onToggleDetail }) => (
  <div>
    <p className="country">{country.name.official}</p>
    <button onClick={onToggleDetail}>Show</button>
  </div>
)

const CountryDetail = ({ country, onToggleDetail }) => (
  <div>
    <h2>{country.name.official}</h2>
    <p><strong>Common name: </strong>{country.name.common}</p>
    <p>Capital: {country.capital[0]}</p>
    <p>Area: {country.area}</p>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`Flag of ${country.name.official}`} />
    <button onClick={onToggleDetail}>Hide</button>
  </div>
)

/* NOTE:
  Props recibidas:
    - name: El nombre del pais que se esta buscando.
    - countriesFilter: La lista de paises filtrada segun el nombre proporcionado por el input
    - selectedCountry: El pais que esta actualmente selecccionado para mostrar detalles
    - selectCountry: La funcion que se llama cuando se selecciona un pais para mostrar sus detalles

  Si el pais es igual al 'selectedCountry', se renderiza el componente 'CountryDetail'
  para mostrar los detalles completos del pais y se proporciona una funcion 'onToggleDetail'
  que, al hacer clic en el boton 'Hide', deselecciona el pais llamando a 'selectCountry(null)'

  Si el pais no es igual al 'selectedCountry', se renderiza el componente 'CountrySummary' para
  mostrar un listado de los paises con el boton 'Show'. Al hacer clic en el boton, se llama
  a 'selectCountry(country)' para seleccionar el pais y mostrar sus detalles.
*/

const CountriesList = ({ name, countriesFilter, selectedCountry, selectCountry }) => {
  if (!countriesFilter) return null

  if (name.length === 0) return <p>Please enter a filter</p>

  if (countriesFilter.length > 10) return <p>Too many matches, specify another filter</p>

  if (countriesFilter.length === 1) {
    return (
      <div>
        {countriesFilter.map(country => (
          <div key={country.name.official}>
            <h2>{country.name.official}</h2>
            <p><strong>Common name: </strong>{country.name.common}</p>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.values(country.languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.official}`} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {countriesFilter.map(country => (
        <div key={country.name.official}>
          {selectedCountry === country
            ? (
            <CountryDetail country={country} onToggleDetail={() => selectCountry(null)} />
              )
            : (
            <CountrySummary country={country} onToggleDetail={() => selectCountry(country)} />
              )}
        </div>
      ))}
    </div>
  )
}

export default CountriesList
