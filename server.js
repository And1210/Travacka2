const express = require('express');
const server = express();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {spawn} = require('child_process');
const tqdm = require('tqdm');

require('dotenv').config();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

//Image serving
server.use('/uploads', express.static('uploads'));
server.use('/uploads-256', express.static('uploads-256'));

//ENV constants
const PORT = process.env.PORT || 5000;

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_URL = process.env.DB_URL;
const DB_CONNECT_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URL}?retryWrites=true&w=majority`;

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

//Database
mongoose.connect(DB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Sucessfully connected to the MongoDB database');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

//Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    // cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({storage: storage});

//DB models
const Personal = require('./models/Personal.js');
const Book = require('./models/Book.js');
const Media = require('./models/Media.js');
const Blog = require('./models/Blog.js');

//------- Serving Routes --------

//User
server.post('/login', (req, res, next) => {
  const {email, password} = req.body;
  const uid = 'prime';
  const name = 'Andrew';

  if (email == 'amf7crazy@gmail.com' && password == 'tester') {
    const token = jwt.sign({uid: uid}, 'my_secret_key', {
      expiresIn: '8h'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        uid: uid,
        name: name,
        email: email
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

server.post('/account', (req, res, next) => {
  const filter = "6479fdf515267e9c3c0e69fe";

  Personal.findById(filter)
    .then((result) => {
      const data = {
        name: result.name,
        bio: result.bio,
        countries: result.desired_countries
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({success: false, message: 'Error in getting account data'});
    });
});

server.post('/account_update', (req, res, next) => {
  const {name, bio, countries} = req.body;

  const filter = "6479fdf515267e9c3c0e69fe";
  const data = {
    name: name,
    bio: bio,
    desired_countries: countries
  };
  const options = {upsert: true};
  Personal.findByIdAndUpdate(filter, data, options)
    .then((result) => {
      res.json({success: true, message: 'Account data updated successfully'});
    })
    .catch((err) => {
      console.log(err);
      res.json({success: false, message: 'Error in updating account, please try again'});
    });
});

//Images
server.post('/upload_img', upload.single('img'), async (req, res, next) => {
  let coords = req.body.coords;
  let date = req.body.date;
  let api_url = '';

  //Parse coordinates from string
  if (coords.length > 0) {
    coords = coords.split(',').map((coord) => parseFloat(coord));
    api_url = `https://api.geoapify.com/v1/geocode/reverse?lat=${coords[1]}&lon=${coords[0]}&format=json&apiKey=${GEOAPIFY_KEY}`;
  } else {
    coords = [];
  }

  //Get location from coordinates
  let location = "";
  if (api_url.length > 0) {
    try {
      let data = await fetch(api_url, {method: 'GET'}).then(res => res.json());
      location = data.results[0].country;
    } catch {
      location = "";
    }
  }

  //Setup json to save to db
  let dataObj = {
    media_type: 'IMAGE',
    date: date,
    filename: req.file.filename,
    description: '',
    url: `uploads/${req.file.filename}`,
    thumbnail_url: `uploads-256/${req.file.filename}`,
    coords: coords,
    location: location
  };

  //Resize and save image
  const pythonProcess = spawn('python', ['./image_resize_single.py', dataObj.url, dataObj.thumbnail_url]);
  pythonProcess.on('close', (code) => {
  });

  //Write to db
  Media.create(dataObj)
    .then((result) => {
      res.json({
        'message': 'Successfully upload image',
        'success': true
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        'message': 'Failed to save image data',
        'success': false
      });
    });

});

server.post('/generate_small_imgs', (req, res, next) => {
  fs.readdir(path.join(__dirname, './uploads'), async (err, files) => {
    if (err)
      console.log(err);

    let count = 0;
    let total = files.length;

    const pythonProcess = spawn('python', ['./image_resize.py', './uploads', './uploads-256']);

    pythonProcess.on('close', (code) => {
      res.json({message: `Small images generated with code ${code}`, success: true});
    });
  });
});

server.post('/update_img_urls', (req, res, next) => {
  console.log('Beginning update of img urls...');
  Media.find({media_type: 'IMAGE'})
    .then(async (result) => {
      for (let r of tqdm(result)) {
        await Media.findOneAndUpdate({_id: r.id}, {thumbnail_url: r.url.replace('uploads/', 'uploads-256/')});
      }
      console.log('Done!');
      res.json({message: 'Updated image urls successfully', success: true});
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
})

server.post('/get_imgs', (req, res, next) => {
  const {location} = req.body;

  let searchObj = {
    location: location
  };

  Media.find(searchObj)
    .then((result) => {
      res.json({
        'message': 'Media found',
        'success': true,
        'data': result
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        'message': 'Invalid location provided, error on media fetch',
        'success': false
      });
    });
});

server.post('/get_countries', (req, res, next) => {
  Media.find().distinct('location')
    .then((result) => {
      let emptyInd = result.indexOf('');
      if (emptyInd >= 0) {
        result.splice(emptyInd, 1);
      }
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});


//Books
server.post('/add_book', (req, res, next) => {
  const {title, author, url} = req.body;

  let data = {
    title: title,
    author: author,
    cover_img_link: url
  };

  Book.create(data)
    .then((result) => {
      res.json({
        message: 'Book successfully added to collection',
        success: true
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

server.post('/get_books', (req, res, next) => {
  Book.find({})
    .then((result) => {
      let out = [];
      for (let d of result) {
        let cur = {};
        cur.title = d.title;
        cur.author = d.author;
        cur.url = d.cover_img_link;
        out.push(cur);
      }
      res.json(out);
    })
    .catch((err) => {
      console.log(err);
    })
});

//Blog
server.post('/generate_blogs', (req, res, next) => {
  let {country} = req.body;

  let searchObj = {
    'location': country
  };

  Media.find(searchObj).sort({date: 1})
    .then(async (result) => {
      let date_data = {};
      for (let r of result) {
        let date_str = (new Date(r.date)).toISOString().substring(0, 10);
        if (!date_data[date_str]) {
          date_data[date_str] = {};
          date_data[date_str].date = date_str;
          date_data[date_str].media_count = 1;
          date_data[date_str].img_urls = [r.url];
          date_data[date_str].coords = r.coords;
          date_data[date_str].location = country;
        } else {
          date_data[date_str].media_count += 1;
          if (!r.url.includes('.mp4')) {
            date_data[date_str].img_urls.push(r.url);

            let cur_coord = date_data[date_str].coords;
            let weight_fac = date_data[date_str].img_urls.length/(date_data[date_str].img_urls.length+1);
            date_data[date_str].coords = [cur_coord[0]*weight_fac+r.coords[0]*(1-weight_fac),
                                         cur_coord[1]*weight_fac+r.coords[1]*(1-weight_fac)];

            // if (sample_count >= 0 && date_data[date_str].urls.length < sample_count) {
            //   date_data[date_str].urls.push(r.url);
            // } else if (sample_count < 0) {
            //   date_data[date_str].urls.push(r.url);
            // }
          }
        }
      }

      for (let key of Object.keys(date_data)) {
        let d = date_data[key];
        //Add specific location tracking later if wanted
        // if (d.coords.length > 0) {
        //   let api_url = `https://api.geoapify.com/v1/geocode/reverse?lat=${coords[1]}&lon=${coords[0]}&format=json&apiKey=${GEOAPIFY_KEY}`;
        //
        // }

        let searchObj = {
          date: d.date
        };
        let update = d;
        let options = {
          upsert: true
        };

        let data_handle = await Blog.findOneAndUpdate(searchObj, update, options);
      }

      res.send({
        message: `${country} blog posts successfully created/updated`,
        success: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

server.post('/get_blogs', (req, res, next) => {
  const {country} = req.body;

  let searchObj = {
    location: country
  };

  Blog.find(searchObj)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

server.post('/edit_blog', (req, res, next) => {
  const {date, post} = req.body;

  const query = {
    date: {
      $gte: new Date(date-86400000/2),
      $lte: new Date(date+86400000/2)
    }
  };

  const update = {
    post: post
  };

  Blog.updateOne(query, update)
    .then((result) => {
      res.json({
        message: 'Post updated successfully',
        success: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

server.post('/update_blog_urls', (req, res, next) => {
  Blog.find({})
    .then(async (result) => {
      for (let r of result) {
        let curUrls = r.img_urls;
        let newUrls = [];
        for (let u of curUrls) {
          newUrls.push(u.replace('uploads/', 'uploads-256/'));
        }
        await Blog.findOneAndUpdate({_id: r.id}, {thumbnail_urls: newUrls});
      }
      res.json({message: 'Blog urls updated successfully', success: true})
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

server.listen(PORT, () => {
  console.log(`Travacka2 API is listening on port ${PORT}`);
});
