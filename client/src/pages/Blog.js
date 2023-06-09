import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SelectionMap from '../components/SelectionMap.js';

import '../styles/Blog.css';

const geoname = require('../helpers/geoname_to_svgname_map.js');

const API_ROUTE = process.env.REACT_APP_API_URL;

function Blog() {
  const [countries, setCountries] = useState([]);
  const [hoverCountry, setHoverCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleCountryClick = (event) => {
    let selected_country = event.target.id;
    setSelectedCountry(selected_country);
  };

  const handleCountryMouseEnter = (event) => {
    let curCountries = [];
    let newCountries = geoname.svg2geo(event.target.id);
    for (let c of newCountries) {
      curCountries.push(c);
    }
    setHoverCountry(curCountries);
  };

  const handleCountryMouseLeave = (event) => {
    setHoverCountry([]);
  };

  useEffect(() => {
    axios.post(`${API_ROUTE}/get_countries`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res.data);
      let newCountries = [];
      for (let c of res.data) {
        if (geoname.checkValidName(c)) {
          newCountries.push(c);
        }
      }
      setCountries(newCountries);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  return (
    <div>
      {selectedCountry.length == 0 && (
        <div className="gallery-selection-grid">
          <div className="gallery-selection-item">
            <h1>Choose A Country To See My Travels!</h1>
            <div className="gallery-countries-container">
              <div className="countries-container">
                <SelectionMap desiredCountries={hoverCountry} onCountryClick={() => {}} />
              </div>
            </div>
          </div>
          <div className="gallery-selection-item country-list">
            {countries.length > 0 && countries.map((country) =>
              <div id={country} className="country-button" onClick={handleCountryClick} onMouseEnter={handleCountryMouseEnter} onMouseLeave={handleCountryMouseLeave}>{country}</div>
            )}
          </div>
        </div>
      )}
      {selectedCountry.length > 0 && (
        <div className="blog-grid">
          <div className="blog-grid-item blog-menu">

          </div>
          <div className="blog-grid-item blog-content">

          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
