import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SelectionMap from '../components/SelectionMap.js';
import LoadingBar from '../components/LoadingBar.js';
import BlogSetupBox from '../components/BlogSetupBox.js';

import '../styles/Account.css';

const API_ROUTE = process.env.REACT_APP_API_URL;

function Account() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [countries, setCountries] = useState([]);
  const [accountStatus, setAccountStatus] = useState('');
  const [savedCountries, setSavedCountries] = useState([]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [bookStatus, setBookStatus] = useState('');
  const [bookData, setBookData] = useState([]);

  const [blogDoneCount, setBlogDoneCount] = useState(0);
  const [blogTotalCount, setBlogTotalCount] = useState(1);
  const [editBlogs, setEditBlogs] = useState([]);

  const handleCountryClick = (name) => {
    let tmpCountries = [...countries];
    if (tmpCountries.includes(name)) {
      tmpCountries.splice(tmpCountries.indexOf(name), 1);
    } else {
      tmpCountries.push(name);
    }
    setCountries(tmpCountries);
  }

  const handlePersonalSubmit = (event) => {
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
      setAccountStatus(res.data.message);
    }).catch((err) => {
      console.log(err);
      setAccountStatus('Error occured');
    });
  };

  const handleGenerateSmallImages = (event) => {
    axios.post(`${API_ROUTE}/generate_small_imgs`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setAccountStatus(res.data.message);
    }).catch((err) => {
      console.log(err);
      setAccountStatus('Error occured');
    });
  }

  const handleUpdateImageURLs = (event) => {
    axios.post(`${API_ROUTE}/update_img_urls`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setAccountStatus(res.data.message);
    }).catch((err) => {
      console.log(err);
      setAccountStatus('Error occured');
    });
  }

  const handleBookSubmit = (event) => {
    event.preventDefault();

    const bookObj = {
      title: title,
      author: author,
      url: url
    };

    axios.post(`${API_ROUTE}/add_book`, bookObj, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      setBookStatus(res.data.message);
      axios.post(`${API_ROUTE}/get_books`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        setBookData(res.data);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
      setBookStatus('Error occured');
    });
    setTimeout(() => {
      setBookStatus('');
    }, 3000);
  }

  const handleGenerateBlogs = async (event) => {
    let finishedCount = 0;
    for (let c of savedCountries) {
      let generateParams = {
        'country': c
      };
      axios.post(`${API_ROUTE}/generate_blogs`, generateParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        finishedCount += 1;
        setBlogDoneCount(finishedCount);
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const handleEditBlogSetup = (event) => {
    let query = {
      country: event.target.id
    };
    axios.post(`${API_ROUTE}/get_blogs`, query, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setEditBlogs(res.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  let handleEditBlog = (date, post) => {
    let dateData = new Date(date);
    dateData.setHours(0, 0, 0, 0);
    dateData = dateData.getTime();
    let data = {
      date: dateData,
      post: post
    };

    axios.post(`${API_ROUTE}/edit_blog`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

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

    axios.post(`${API_ROUTE}/get_countries`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setSavedCountries(res.data);
      setBlogTotalCount(res.data.length);
    }).catch((err) => {
      console.log(err);
    });

    axios.post(`${API_ROUTE}/get_books`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setBookData(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div>
      <div className="account-grid-container">
        <div className="account-grid-item account-personal-sec">
          <div className="form-wrapper">
            <form method="POST" onSubmit={handlePersonalSubmit}>
              <label>Name:</label><input type="text" name="name" defaultValue={name || ''} onChange={(event) => setName(event.target.value)} required />
              <label>Bio:</label><textarea name="bio" defaultValue={bio || ''} onChange={(event) => setBio(event.target.value)} required />
              <button type="submit">Update</button>
            </form>
            <button onClick={handleGenerateSmallImages}>Generate Small Images</button>
            <button onClick={handleUpdateImageURLs}>Update Image Links</button>
            <div className="account-countries-container">
              <SelectionMap desiredCountries={countries} onCountryClick={handleCountryClick}/>
            </div>
            {accountStatus.length > 0 && (
              <div>{accountStatus}</div>
            )}
          </div>
        </div>
        <div className="account-grid-item account-dashboard-sec">
          <button onClick={handleGenerateBlogs}>Generate Blogs</button>
          <LoadingBar progress={blogDoneCount} total={blogTotalCount} />
          {savedCountries.map((country) =>
            <button id={country} onClick={handleEditBlogSetup}>{country}</button>
          )}
          {editBlogs.length > 0 && (
            editBlogs.map((blog) =>
              <BlogSetupBox dateData={blog} cmRoute={API_ROUTE} cb={handleEditBlog}/>
            )
          )}
        </div>
        <div className="account-grid-item account-book-sec">
          <div className="form-wrapper">
            <form method="POST" onSubmit={handleBookSubmit}>
              <label>Title:</label><input type="text" name="title" onChange={(event) => setTitle(event.target.value)} required />
              <label>Author:</label><input type="text" name="author" onChange={(event) => setAuthor(event.target.value)} required />
              <label>Cover Image Url:</label><input type="text" name="cover_img_url" onChange={(event) => setUrl(event.target.value)} required />
              <button type="submit">Add Book</button>
            </form>
            {bookStatus.length > 0 && (
              <div>{bookStatus}</div>
            )}
          </div>
          {bookData.length > 0 && bookData.map((book) =>
            <div>{book.title} by {book.author}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
