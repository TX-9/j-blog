jest.setTimeout(20000);
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise; // Node js global Promise object
mongoose.connect(kyes.mongoURI, { useMongoClient: true});