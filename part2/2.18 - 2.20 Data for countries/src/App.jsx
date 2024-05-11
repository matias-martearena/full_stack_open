import { useState, useEffect } from 'react'
import CountriesServices from './services/countries'
import Filter from './components/Filter'
import CountriesList from './components/CountriesList'

function App () {
  const [countries, setCountries] = useState(null)
  const [findName, setFindName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    CountriesServices
      .getAll()
      .then(countries => setCountries(countries))
      .catch(error => console.error(error))
  }, [])

  if (!countries) return null

  const handleFindName = e => setFindName(e.target.value)
  const selectCountry = country => setSelectedCountry(country)

  const filteredCountries = countries.filter(countrie =>
    countrie.name.official.toLowerCase().includes(findName.toLowerCase())
  )

  return (
    <section>
      <h1>Countries</h1>
      <Filter name={findName} onFindName={handleFindName}/>
      <CountriesList
        name={findName}
        countriesFilter={filteredCountries}
        selectedCountry={selectedCountry}
        selectCountry={selectCountry}
      />
    </section>
  )
}

export default App
