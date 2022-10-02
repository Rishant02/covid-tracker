import { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@mui/material'
import Infobox from './components/Infobox'
import Map from './components/Map'
import Table from './components/Table'
import { sortData, printPrettyStats } from './utils/utils'
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css'
function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountry, setMapCountry] = useState([])
  const [casesType, setCasesType] = useState('cases')
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(res => res.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          setMapCountry(data)
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
        })
    }
    getCountriesData();
  }, [countries])
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode)
        setCountryInfo(data)
        setMapCenter(countryCode === 'worldwide' ? { lat: 34.80746, lng: -40.4796 } : [data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(countryCode === 'worldwide' ? 3 : 4)
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, i) => (
                <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Infobox
            isRed
            isActive={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title="Coronavirus cases"
            total={printPrettyStats(countryInfo.cases)}
            cases={printPrettyStats(countryInfo.active)} />
          <Infobox
            isActive={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            total={printPrettyStats(countryInfo.recovered)}
            cases={printPrettyStats(countryInfo.todayRecovered)} />
          <Infobox
            isRed
            isActive={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            total={printPrettyStats(countryInfo.deaths)}
            cases={printPrettyStats(countryInfo.todayDeaths)} />
        </div>
        <Map casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountry} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide New Cases</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
