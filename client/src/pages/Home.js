import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DestinationMap from '../components/DestinationMap.js';
import BookCard from '../components/BookCard.js';

import '../styles/Home.css';

import headshot from '../imgs/headshot.jpg';
import bannerImg from '../imgs/banner.jpg'

const API_ROUTE = process.env.REACT_APP_API_URL;

function Home() {
  const [personal, setPersonal] = useState({});
  const [bookData, setBookData] = useState([]);

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
  }, []);

  // <div className="page-title center-text-img">
  //   Where the Hell Did Andrew Go?
  // </div>
  return (
    <div>
      <div className="banner-container">
        <img className="banner-img" src={bannerImg} />
      </div>
      <div className="container">
        <div className="grid-container">
          {personal.bio && (
            <div className="grid-item bio-sec">
              <img className="headshot-img" src={headshot} alt="Picture" />
              <h1>{personal.name || 'Error'}</h1>
              {personal.bio.split(/\r?\n/).map((text) =>
                <p className="bio-text">{text || 'Error loading data from server'}</p>
              )}
            </div>
          )}

          <div className="grid-item countries-sec">
            <div className="countries-container">
              <DestinationMap desiredCountries={personal.countries} visitedCountries={[]} />
            </div>
          </div>

          <div className="grid-item books-sec">
            <h3>The Books I've Read (count: {bookData.length})</h3>
            <div className="books-container">
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
