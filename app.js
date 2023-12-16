const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoURI = require('./util/protected').mongoURI;
const secret = require('./util/protected').secret;
const AWSKey = require('./util/protected').AWSAccessKey;
const AWSSecret = require('./util/protected').AWSSecretAccessKey;
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const compression = require('compression');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const User = require('./models/user');

const authRoutes = require('./routes/login');
const teamRoutes = require('./routes/team');
const userRoutes = require('./routes/user');
const escalationRoutes = require('./routes/escalation');
const updateRoutes = require('./routes/update');

const app = express();

AWS.config.update({
    accessKeyId: AWSKey,
    secretAccessKey: AWSSecret,
    region: 'us-east-2'
})

const store = new MongoDBStore({
    uri: mongoURI,
    collection: 'sessions'
})

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'efficient-comms',
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname})
        },
        key: function(req, file, cb) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            cb(null, timestamp + '-' + file.originalname)
        }
    })
})

app.use(helmet());
app.use(compression());

app.use(bodyParser.json());
app.use(upload.array('files'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use('/login', authRoutes);
app.use('/team', teamRoutes);
app.use('/user', userRoutes);
app.use('/escalation', escalationRoutes);
app.use('/update', updateRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    if (error.msg.indexOf('server') !== -1) {
        res.status(500).json(error);
    } else {
        res.status(400).json(error);
    }
});

app.get('**', (req, res, next) => {res.sendFile(path.join(__dirname, 'public', 'index.html'))});

User.find().then(users => {
    if (users.length === 0) {
        bcrypt.hash('TempPassword', 12)
            .then(hashedPassword => {
                const newAdmin = new User({
                    name: 'Admin',
                    email: 'Admin@Admin.com',
                    password: hashedPassword,
                    role: 'Admin',
                    teamId: 'Admin',
                    peerReviewer: false
                });
                newAdmin.save();
            })
    }
});

mongoose
    .connect(mongoURI)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });