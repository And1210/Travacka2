import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';

import SelectionMap from '../components/SelectionMap.js';
import ImageModal from '../components/ImageModal.js';

import '../styles/Blog.css';

const geoname = require('../helpers/geoname_to_svgname_map.js');

const API_ROUTE = process.env.REACT_APP_API_URL;

function Blog() {
  //Country selection
  const [countries, setCountries] = useState([]);
  const [hoverCountry, setHoverCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  //Calendar variables
  const [calendar, setCalendar] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  //Blog variables
  const [blogData, setBlogData] = useState([]);
  const [curBlog, setCurBlog] = useState(0);
  //Image displaying
  const [imgModalSrc, setImgModalSrc] = useState(null);

  //Country selection functions
  const handleCountryClick = (event) => {
    let selected_country = event.target.id;
    setSelectedCountry(selected_country);
    setCurBlog(0);
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

  //Calendar functions
  const onCalendarChange = (nextValue) => {
    setCalendar(nextValue);
    let nextIndex = blogData.findIndex((item, i) => {
      let arrDate = new Date(item.date);
      arrDate.setHours(0, 0, 0, 0);
      return arrDate.getTime() == nextValue.getTime();
    });
    if (nextIndex != -1) {
      setCurBlog(nextIndex);
    }
  };
  const dateDisabled = ({date, view}) => {
    if (view == 'month') {
      return !availableDates.includes(date.getTime());
    }
  };

  //Image display functions
  const handleImgClick = (event) => {
    setImgModalSrc(event.target.currentSrc);
  };
  const handleCloseModal = (event) => {
    setImgModalSrc(null);
  };

  //Effects
  useEffect(() => {
    let data = {
      country: selectedCountry
    };
    axios.post(`${API_ROUTE}/get_blogs`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setBlogData(res.data);
      let newAvailableDates = [];
      for (let b of res.data) {
        let curDate = new Date(b.date);
        curDate.setHours(0, 0, 0, 0);
        curDate = curDate.getTime();
        newAvailableDates.push(curDate);
      }
      setAvailableDates(newAvailableDates);
    }).catch((err) => {
      console.log(err);
    });
  }, [selectedCountry]);

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
      {imgModalSrc && (
        <ImageModal src={imgModalSrc} onClose={handleCloseModal} />
      )}
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
      {selectedCountry.length > 0 && blogData.length > 0 && (
        <div className="blog-grid">
          <div className="blog-grid-item blog-menu">
            {availableDates.length > 0 && (
              <div>
                <Calendar onChange={onCalendarChange} value={calendar} defaultActiveStartDate={new Date(availableDates[0])} tileDisabled={dateDisabled} />
              </div>
            )}
          </div>
          <div className="blog-grid-item blog-title">
            <h4>{blogData[curBlog].date}</h4>
            <h5>In: {blogData[curBlog].location}</h5>
            <h5># of images: {blogData[curBlog].media_count}</h5>
          </div>
          <div className="blog-grid-item blog-content">
            <div className={`blog-content-grid-${blogData[curBlog].media_count < 16 ? "few" : "many"}img`}>
              <div className={`blog-content-grid-item blog-post-${blogData[curBlog].media_count < 16 ? "few" : "many"}img`}>
                <div>{blogData[curBlog].post}</div>
              </div>
              {blogData[curBlog].img_urls.map((url) =>
                <div className="blog-content-grid-item">
                  <img className="blog-image" onClick={handleImgClick} src={`${API_ROUTE}/${url}`} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
