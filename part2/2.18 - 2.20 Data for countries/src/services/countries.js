import axios from 'axios'

const getAll = async () => {
  const request = await axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
  return request.data
}

const getLatLon = async country => {
  const countryLatLon = `http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_TOKEN}`
  const request = await axios.get(countryLatLon)
  return {
    latitude: request.data[0].lat,
    longitude: request.data[0].lon
  }
}

const getSomeWeather = async info => {
  const openweather = `https://api.openweathermap.org/data/2.5/weather?lat=${info.latitude}&lon=${info.longitude}&appid=${import.meta.env.VITE_OPENWEATHER_TOKEN}`
  const request = await axios.get(openweather)
  return {
    weather: request.data.weather[0],
    main: request.data.main,
    wind: request.data.wind
  }
}

export default { getAll, getLatLon, getSomeWeather }
