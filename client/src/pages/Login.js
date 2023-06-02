import { React, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const API_ROUTE = process.env.REACT_APP_API_URL;//'http://localhost:5000';
// const API_ROUTE = 'http://167.99.187.48';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, logout, loggedIn} = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn) {
      logout();
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    let loginObj = {
      email: email,
      password: password
    };

    axios.post(`${API_ROUTE}/login`, loginObj, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      const {token} = res.data;
      const {uid} = res.data.user;
      login(token, uid);
      navigate('/');
    }).catch((err) =>  {
      console.log(err);
    })
  }

  if (!loggedIn) {
    return (
      <form method="POST" onSubmit={handleSubmit}>
        <label>Email:</label><input type="email" name="email" onChange={(event) => setEmail(event.target.value)} required />
        <label>Password:</label><input type="password" name="password" onChange={(event) => setPassword(event.target.value)} required />
        <button type="submit">Login</button>
      </form>
    );
  } else {
    return (
      <div>Successfully logged out</div>
    );
  }
}

export default Login;
