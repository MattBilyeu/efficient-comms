const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoURI = require('./util/protected').mongoURI;
const secret = require('./util/protected').secret;

const app = express();

const store = new MongoDBStore({
    uri: mongoURI,
    collection: 'sessions'
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/files'))
    },
    filename: (req, file, cb)=> {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, timestamp + '-' + file.originalname)
    }
});

app.use(bodyParser.json());
app(multer({storage: fileStorage}).array('pdf'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

mongoose
    .connect(mongoURI)
    .then(result => {
        console.log('Connected');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });