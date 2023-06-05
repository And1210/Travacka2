import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {usePagination} from 'react-use-pagination';

import SelectionMap from '../components/SelectionMap.js';

import '../styles/Gallery.css';

const geoname = require('../helpers/geoname_to_svgname_map.js');

const API_ROUTE = process.env.REACT_APP_API_URL;

function Gallery() {
  const [countries, setCountries] = useState([]);
  const [hoverCountry, setHoverCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [imgData, setImgData] = useState([]);
  const [dataLength, setDataLength] = useState(0);

  // let currentPage, totalPages, setNextPage, setPreviousPage, nextEnabled, previousEnabled, startIndex, endIndex;
  const {
        currentPage,
        totalPages,
        setNextPage,
        setPreviousPage,
        nextEnabled,
        previousEnabled,
        startIndex,
        endIndex,
        pageSize
    } = usePagination({ totalItems: dataLength, initialPageSize: 24 });

  const handleCountryClick = (event) => {
    let selected_country = event.target.id;

    let filter = {
      location: selected_country
    };

    axios.post(`${API_ROUTE}/get_imgs`, filter, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setImgData(res.data.data);
      setSelectedCountry(selected_country);
    }).catch((err) => {
      console.log(err);
    });
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
    setDataLength(imgData.length);
  }, [imgData]);

  useEffect(() => {
    axios.post(`${API_ROUTE}/get_countries`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
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
            <div className="countries-container">
              <SelectionMap desiredCountries={hoverCountry} onCountryClick={() => {}} />
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
        <div>
        {imgData.length > 0 && (
          <div>
            <div className="gallery-image-grid">
              {imgData.slice(startIndex, startIndex+pageSize).map((img) =>
                <div className="gallery-image-item">
                  <img className="gallery-image" src={`${API_ROUTE}/${img.url}`} />
                </div>
              )}
            </div>
            <div onClick={() => setPreviousPage()}>Prev</div>
            <div onClick={() => setNextPage()}>Next</div>
          </div>
        )}
        {imgData.length == 0 && (
          <div>Data loading... please wait</div>
        )}
        </div>
      )}
    </div>
  );
}

export default Gallery;