// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();
const PORT = process.env.PORT || 5000;

// Setup Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder --> sets static folder
app.use(express.static('website'));

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
//I understand tha bodyParser is deprecated, and now express incorporates its funcionality
// I used bodyParser though
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup empty JS object to act as endpoint for all routes
projectData = {};
weather = [];

//POST new data to server
app.post('/create', (req, res) => {
    const newWeather = {
        name: req.body.name,
        date: req.body.date,
        feels_like: req.body.main.feels_like,
        humidity: req.body.main.humidity,
        temp: req.body.main.temp,
        temp_max: req.body.main.temp_max,
        temp_min: req.body.main.temp_min,
        wind_speed: req.body.wind.speed,
        description: req.body.weather[0].description,
        feelings: req.body.feelings,
    }
    weather.push(newWeather);
    projectData.all_weather = weather;
    console.log(projectData);

    res.send(projectData);
});

//GET all data from server
app.get('/all_data', (req, res) => {
    res.send(projectData);
});








