// This code is for The Caring Connection, a website designed to connect people who are in need of care with people who are able to provide that care. 

// App Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize App 
const app = express();

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure Database Connection
const db = require('./config/db');
mongoose.connect(db.mongoURL, { useNewUrlParser: true });

// Setup Session Store
app.use(session({
    secret: 'secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true
}));

// Setup cors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Setup Static Folder
app.use(express.static('public'));

// Set Routes
const index = require('./routes/index');
const services = require('./routes/services');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const contact = require('./routes/contact');

app.use('/', index);
app.use('/services', services);
app.use('/users', users);
app.use('/reviews', reviews);
app.use('/contact', contact);

// Catch 404 Errors and Forward Them to Error Handlers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handler
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    // Respond To Client
    res.status(status).json({
        error: {
            message: error.message
        }
    });
});

// Port Setup
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is Listening on Port ${port}`));