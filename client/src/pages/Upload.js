import React, {useState, useEffect} from 'react';
import axios from 'axios';
import exifr from 'exifr';

import LoadingBar from '../components/LoadingBar.js';

import '../styles/Upload.css';

const API_ROUTE = process.env.REACT_APP_API_URL;

function Upload() {
  const [imgData, setImgData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [progressCount, setProgressCount] = useState(0);

  // useEffect(() => {
  //   console.log(imgData);
  //   console.log(imgData.length);
  // }, [imgData]);

  const handleFileInput = (event) => {
    setImgData(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let total_count = imgData.length;
    setTotalCount(total_count);
    let progress_count = 0;

    let updated_locations = new Set();

    for (let i = 0; i < imgData.length; i++) {
      const formData = new FormData();

      //Add image data
      formData.append('img', imgData[i]);

      //Add coordinate data
      let coords = [];
      try {
        let {latitude, longitude} = await exifr.gps(imgData[i]);
        coords = [longitude, latitude];
      } catch (err) {
      }
      formData.append('coords', coords);

      formData.append('date', imgData[i].lastModified);

      await axios.post(`${API_ROUTE}/upload_img`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        progress_count += 1;
        setProgressCount(progress_count);
        updated_locations.add(res.location);
      }).catch((err) => {
        console.log(err);
        progress_count += 1;
        setProgressCount(progress_count);
      });
    }

    updated_locations.forEach((country) => {
      axios.post(`${API_ROUTE}/generate_blogs`, {country: country}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  return (
    <div>
      <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Image:
          <input id="img" name="img" type="file" multiple="multiple" accept="image/*" onChange={handleFileInput} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div className="upload-progress-container">
        <LoadingBar progress={progressCount} total={totalCount} />
      </div>
    </div>
  );
}

export default Upload;
