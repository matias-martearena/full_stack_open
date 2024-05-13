import { useState, useEffect } from 'react'
import CountriesServices from './services/countries'
import Filter from './components/Filter'
import CountriesList from './components/CountriesList'

function App () {
  const [findName, setFindName] = useState('')
  const [countries, setCountries] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryName, setCountryName] = useState(null)
  const [latLon, setLatLon] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    CountriesServices
      .getAll()
      .then(countries => setCountries(countries))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    if (latLon) {
      CountriesServices
        .getSomeWeather(latLon)
        .then(weather => setWeather(weather))
        .catch(error => console.error(error))
    }
  }, [latLon])

  useEffect(() => {
    if (countryName) {
      CountriesServices
        .getLatLon(countryName)
        .then(latlon => setLatLon(latlon))
        .catch(error => console.error(error))
    }
  }, [countryName])

  if (!countries) return null

  const handleFindName = e => setFindName(e.target.value)
  const selectCountry = country => setSelectedCountry(country)
  const filteredCountries = countries.filter(countrie =>
    countrie.name.official.toLowerCase().includes(findName.toLowerCase())
  )

  if (filteredCountries.length === 1 && countryName === null) {
    setCountryName(filteredCountries[0].capital[0])
  } else if (findName.length === 0 && countryName !== null) {
    setCountryName(null)
  }

  // TIP:
  // console.log(filteredCountries[0].cca2)
  // console.log(filteredCountries[0].capital[0])
  // console.log(countryName)
  // console.log(latLon)
  // console.log(weather)

  return (
    <section>
      <h1>Countries</h1>
      <Filter name={findName} onFindName={handleFindName}/>
      <CountriesList
        name={findName}
        countriesFilter={filteredCountries}
        selectedCountry={selectedCountry}
        selectCountry={selectCountry}
        weather={weather}
      />
    </section>
  )
}

export default App
