/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

// Weather component
const Weather = ({ weather, isShown }) => {
  return isShown ? (
    <div>
      <p>Weather in {weather.name}</p>
      <p>Temperature: {weather.main.temp} °C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather Icon"
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  ) : null;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]); // Countries returned from the API
  const [selectedCountry, setSelectedCountry] = useState(null); // The country selected
  const [weather, setWeather] = useState(null); // Weather data
  const [isShown, setIsShown] = useState(false); // Weather visibility flag

  const apiKey = "4e7206e7bb7ab0814ad9bd31872f2b58"; // Replace this with a secure key

  // Fetching country data on initial load
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Fetching weather data if a country is selected and has a capital
  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital}&appid=${apiKey}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
          setIsShown(true); // Show the weather once fetched
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedCountry]); // Fetch weather data when selectedCountry changes

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
    setSelectedCountry(null); // Clear selected country when search term changes
    setIsShown(false);
  }

  // Filter countries based on the search term
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Display detailed information for a selected country
  function showCountryInfo(country) {
    setSelectedCountry(country);
  }

  let renderCountryContent;

  if (selectedCountry) {
    renderCountryContent = (
      <div>
        <h1>{selectedCountry.name.common}</h1>
        <p>Capital: {selectedCountry.capital}</p>
        <p>Area: {selectedCountry.area}</p>
        <h3>Languages:</h3>
        <ul>
          {Object.entries(selectedCountry.languages).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
        <img src={selectedCountry.flags.png} alt="Flag" />
      </div>
    );
  } else if (filteredCountries.length === 0) {
    renderCountryContent = <p>No matches found.</p>;
  } else if (filteredCountries.length > 10) {
    renderCountryContent = (
      <p>Too many matches, please specify another filter.</p>
    );
  } else if (filteredCountries.length === 1) {
    showCountryInfo(filteredCountries[0]); // Automatically select the country
  } else {
    renderCountryContent = (
      <ul className="countries">
        {filteredCountries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => showCountryInfo(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <h2>Find countries:</h2>
      <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
      {renderCountryContent}
      {weather && <Weather weather={weather} isShown={isShown} />}
    </div>
  );
}

export default App;
