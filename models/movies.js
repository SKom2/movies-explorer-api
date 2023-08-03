const mongoose = require('mongoose');

const moviesSchema = mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(value);
      }
    }
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}/.test(value);
      }
    }
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(value);
      }
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  nameRU: {
    type: String,
    required: true
  },
  nameEN: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('movies', moviesSchema);

// {
//   "country": "Russia",
//   "director": "Chris",
//   "duration": "2h",
//   "year": "2003",
//   "description": "description",
//   "image": "https://img.freepik.com/free-photo/assortment-of-cinema-elements-on-red-background-with-copy-space_23-2148457848.jpg?w=1060&t=st=1689518002~exp=1689518602~hmac=59ed82699443d3e03eeccf0c64c558be4e104f8b389c1d49a1a9d9b6afac1cb6",
//   "trailerLink": "https://www.youtube.com/watch?v=6ybBuTETr3U",
//   "thumbnail": "https://img.freepik.com/free-photo/assortment-of-cinema-elements-on-red-background-with-copy-space_23-2148457848.jpg?w=1060&t=st=1689518002~exp=1689518602~hmac=59ed82699443d3e03eeccf0c64c558be4e104f8b389c1d49a1a9d9b6afac1cb6",
//   "movieId": "1",
//   "nameRU": "Интерстеллар",
//   "nameEN": "Interstellar"
// }
