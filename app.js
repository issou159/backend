const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');

// Middleware
app.use(express.json());

// Routes
app.use('/doctors', routes);
app.use('/patients', routes);
app.use('/appointments',routes);

// Connexion to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Patient', { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(4000, () => {
            console.log(`Node is running in port 4000`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
module.exports= app ;