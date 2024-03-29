import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DestinationMap from '../components/DestinationMap.js';
import BookCard from '../components/BookCard.js';
import FlowFieldBG from '../components/FlowFieldBG.js';
import TravelBG from '../components/TravelBG.js';

import '../styles/Home.css';

import headshot from '../imgs/headshot.jpg';
import bannerImg from '../imgs/banner.jpg'

const geoname = require('../helpers/geoname_to_svgname_map.js');

const API_ROUTE = process.env.REACT_APP_API_URL;

function Home() {
  const [personal, setPersonal] = useState({});
  const [bookData, setBookData] = useState([]);
  const [visitedCountries, setVisitedCountries] = useState([]);

  useEffect(() => {
    axios.post(`${API_ROUTE}/account`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      let data = {
        name: res.data.name,
        bio: res.data.bio,
        countries: res.data.countries
      };
      setPersonal(data);
    }).catch((err) => {
      console.log(err);
    });

    axios.post(`${API_ROUTE}/get_books`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res.data);
      setBookData(res.data);
    }).catch((err) => {
      console.log(err);
    });

    axios.post(`${API_ROUTE}/get_countries`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      let newCountries = [];
      for (let c of res.data) {
        if (geoname.checkValidName(c)) {
          let toAdd = geoname.svg2geo(c);
          for (let t of toAdd) {
            newCountries.push(t);
          }
        }
      }
      setVisitedCountries(newCountries);
    }).catch((err) => {
      console.log(err);
    })
  }, []);
  // <div className="background-sketch">
  // <TravelBG />
  // </div>

  return (
    <div>
      <div className="banner-container">
        <img className="banner-img" src={bannerImg} />
        <div className="home-title">Where The Heck Did Andrew Go?</div>
      </div>
      <div className="container">
        <div className="grid-container">
          {personal.bio && (
            <div className="grid-item bio-sec">
              <img className="headshot-img" src={headshot} alt="Picture" />
              <div className="home-subtitle">{personal.name || 'Error'}</div>
              <div className="home-body-text">
                {personal.bio.split(/\r?\n/).map((text) =>
                  <p className="bio-text">{text || 'Error loading data from server'}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid-item countries-sec">
            <div className="countries-container home-body-text">
              <DestinationMap desiredCountries={personal.countries} visitedCountries={visitedCountries} />
            </div>
          </div>

          <div className="grid-item books-sec">
            <div className="book-title">The Books I've Read (count: {bookData.length})</div>
            <div className="books-container home-body-text">
              {bookData.map((book) =>
                <BookCard title={book.title} author={book.author} url={book.url} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
