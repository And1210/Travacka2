import React, {useState, useEffect} from 'react';
import axios from 'axios';

const API_ROUTE = process.env.REACT_APP_API_URL;

function Account() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [countries, setCountries] = useState([]);
  const [curData, setCurData] = useState({});
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const accountObj = {
      name: name,
      bio: bio,
      desired_countries: countries
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
      console.log(res);
      setName(res.name);
      setBio(res.bio);
      setCountries(res.countries);
      setCurData(res);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        {curData && (
          <>
            <label>Name:</label><input type="text" name="name" value={curData.name} onChange={(event) => setName(event.target.value)} required />
            <label>Bio:</label><textarea name="bio" value={curData.bio} onChange={(event) => setBio(event.target.value)} required />
          </>
        )}
        <button type="submit">Update</button>
      </form>
      {status.length > 0 && (
        <div>status</div>
      )}
    </div>
  );
}

export default Account;
