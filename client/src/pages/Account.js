import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SelectionMap from '../components/SelectionMap.js';

import '../styles/Account.css';

const API_ROUTE = process.env.REACT_APP_API_URL;

function Account() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState('');

  const handleCountryClick = (name) => {
    let tmpCountries = [...countries];
    if (tmpCountries.includes(name)) {
      tmpCountries.splice(tmpCountries.indexOf(name), 1);
    } else {
      tmpCountries.push(name);
    }
    setCountries(tmpCountries);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const accountObj = {
      name: name,
      bio: bio,
      countries: countries
    };

    axios.post(`${API_ROUTE}/account_update`, accountObj, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      setStatus(res.data.message);
    }).catch((err) => {
      console.log(err);
      setStatus('Error occured');
    });
  };

  useEffect(() => {
    axios.post(`${API_ROUTE}/account`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setName(res.data.name);
      setBio(res.data.bio);
      setCountries(res.data.countries);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div>
      <div className="form-wrapper">
        <form method="POST" onSubmit={handleSubmit}>
          <label>Name:</label><input type="text" name="name" defaultValue={name || ''} onChange={(event) => setName(event.target.value)} required />
          <label>Bio:</label><textarea name="bio" defaultValue={bio || ''} onChange={(event) => setBio(event.target.value)} required />
          <SelectionMap desiredCountries={countries} onCountryClick={handleCountryClick}/>
          <button type="submit">Update</button>
        </form>
        {status.length > 0 && (
          <div>{status}</div>
        )}
      </div>
    </div>
  );
}

export default Account;
