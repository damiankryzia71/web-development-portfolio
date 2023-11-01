/**
 * Weather App by Damian Kryzia
 * Simple weather Web Application
 * Includes weather information and hourly forecast for the current day, simple forecast for the following 6 days
 * User can search for any location. In case of an error, the application returns to user's current location.
 * Public API used: https://www.weatherapi.com/ (Uses API key authentication - below, my key is used.)
 * 
 * To run this application, install Node.js. Then, in the command line, type "npm i", followed by "node index.js"
 * 
 * Languages and technologies used: HTML, CSS, JavaScript, EJS, Node.js, Express.js, Axios, Weather API
 * 
 * Copyright note: This application is not for commercial used. It is only a project serving as personal pracitce.
 * All weather images used are made by Neven: https://dribbble.com/shots/2721869-Weather-icons-source-file
 */

import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

const apiURL = "http://api.weatherapi.com/v1";
const apiKey = "efd9035bc58a4ad18e4215733233110";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/**
 * Default GET path. Gets weather information for current time and location.
 */
app.get("/", async (req, res) => {
    try {
        const result = await axios.get(`${apiURL}/forecast.json?key=${apiKey}&q=auto:ip&days=7`);
        const data = getRelevantWeatherData(result.data);
        res.render("index.ejs", data);
    }
    catch (error) {
        res.send(error.message);
    }
});

/**
 * POST path for requesting data on specified location.
 */
app.post("/request", async (req, res) => {
    try {
        const requestedLocation = req.body.location;
        const result = await axios.get(`${apiURL}/forecast.json?key=${apiKey}&q=${requestedLocation}&days=7`);
        const data = getRelevantWeatherData(result.data);
        res.render("index.ejs", data); 
    }
    catch (error) {
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/**
 * Formats the weather data received from WeatherAPI to contain the data relevant to this application,
 * that is then passed to index.ejs
 * @param {Object} requestResult - The object returned by a request sent by AXIOS to WeatherAPI
 * @returns {Object} An object containing relevant weather data
 */
function getRelevantWeatherData(requestResult) {
    return {
        today: {
            location: requestResult.location.name,
            temp_C: requestResult.current.temp_c,
            temp_F: requestResult.current.temp_f,
            date: getFullDateFormatted(requestResult.location.localtime),
            imagePath: getImagePath(requestResult.current.condition.code, getIsDay(requestResult.location.localtime))
        },
        hourly: [
            getHourlyForecastObject(requestResult, new Date().getHours() + 1),
            getHourlyForecastObject(requestResult, new Date().getHours() + 2),
            getHourlyForecastObject(requestResult, new Date().getHours() + 3),
            getHourlyForecastObject(requestResult, new Date().getHours() + 4),
            getHourlyForecastObject(requestResult, new Date().getHours() + 5),
            getHourlyForecastObject(requestResult, new Date().getHours() + 6),
        ],
        weekly: [
            getWeeklyForecastObject(requestResult, 1),
            getWeeklyForecastObject(requestResult, 2),
            getWeeklyForecastObject(requestResult, 3),
            getWeeklyForecastObject(requestResult, 4),
            getWeeklyForecastObject(requestResult, 5),
            getWeeklyForecastObject(requestResult, 6),
        ]
    };
}

/**
 * Formats a date string to display it on the website
 * @param {string} dateString - A date string in the form received from WeatherAPI, e.g. "2023-10-31 21:00"
 * @returns A formatted date, e.g. "Tuesday, October 31"
 */
function getFullDateFormatted(dateString) {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];

    return `${day}, ${month} ${date.getDate()}`
}

/**
 * Formats a day of the week to display it on the website
 * @param {string} dateString - A date string in the form received from WeatherAPI, e.g. "2023-10-31 21:00"
 * @returns A formatted day of the week in English, e.g. "Tuesday"
 */
function getDayOfWeekFormatted(dateString) {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    return days[date.getDay()];
}

/**
 * Gets the file path to an image representing a weather condition based on the condition code received from WeatherAPI
 * @param {Number} conditionCode - A condition code received from WeatherAPI, e.g. 1000
 * @param {Boolean} isDay - Boolean indicating whether the local time is day or night, e.g. true
 * @returns A file path to the correct image, e.g. "images/sun.png"
 */
function getImagePath(conditionCode, isDay) {
    switch (conditionCode) {
        case 1000: // Sunny
            if (isDay) {
                return "images/sun.png";
            }
            else {
                return "images/moon.png";
            }
        case 1003: // Partly cloudy
        case 1006: // Cloudy
        case 1030: // Mist
        case 1009: // Overcast
        case 1135: // Fog
            return "images/cloud.png";
        case 1114: // Blowing snow
        case 1117: // Blizzard
        case 1210: // Patchy light snow
        case 1213: // Light snow
        case 1216: // Patchy moderate snow
        case 1219: // Moderate snow
        case 1222: // Patchy heavy snow
        case 1225: // Heavy snow
        case 1237: // Ice pellets
        case 1252: // Light sleet showers
        case 1255: // Light snow showers
        case 1261: // Light showers of ice pellets
        case 1066: // Patchy snow possible
        case 1069: // Patchy sleet possible
            return "images/snow.png";
        case 1063: // Patchy rain possible
        case 1072: // Patchy freezing drizzle possible
        case 1180: // Patchy light rain
        case 1189: // Moderate rain at times
        case 1192: // Heavy rain at times
        case 1240: // Light rain shower
        case 1243: // Moderate or heavy rain shower
        case 1246: // Torrential rain shower
        case 1183: // Light rain
        case 1153: //Light drizzle
            return "images/rain.png";
        case 1087: // Thundery outbreaks possible
        case 1273: // Patchy light rain with thunder
        case 1276: // Moderate or heavy rain with thunder
        case 1279: // Patchy light snow with thunder
        case 1282: // Moderate or heavy snow with thunder
            return "images/storm.png";
    }
}

/**
 * Checks whether it's day or night based on local date and time
 * @param {string} localtime - A date string as received from WeatherAPI, e.g. "2023-10-32 21:00"
 * @returns Boolean indicating whether the local time is day or night, e.g. true
 */
function getIsDay(localtime) {
    const hour = localtime.slice(11, 13);

    if ((hour >= 20) || (hour <= 4)) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * Creates an object that represents a simple forecast for a given object, to be used in the weekly forecast part of the website
 * @param {Object} requestResult - The object returned by a request sent by AXIOS to WeatherAPI
 * @param {Number} requestedDay - The day requested, out of 7
 * @returns An object containing forecast data for the given day, including the formatted day of the week in English, average temperature in Celcius,
 *          average temperature in Fahrenheit, and the file path to an appropriate image
 */
function getWeeklyForecastObject(requestResult, requestedDay) {
    return {
        day: getDayOfWeekFormatted(requestResult.forecast.forecastday[requestedDay].date + " 12:00"),
        temp_C: requestResult.forecast.forecastday[requestedDay].day.avgtemp_c,
        temp_F: requestResult.forecast.forecastday[requestedDay].day.avgtemp_f,
        imagePath: getImagePath(requestResult.forecast.forecastday[requestedDay].day.condition.code, true)
    };
}

/**
 * Creates an object that represents a simple forecast for a given hour, to be used in the hourly forecast part of the website
 * @param {Object} requestResult - The object returned by a request sent by AXIOS to WeatherAPI
 * @param {Number} requestedHour - The hour requested, 0 - 23 (formats the hour in case it goes over 23)
 * @returns An object containing forecast data for the given hour, including the hour itself, temperature in Celcius,
 *          temperature in Fahrenheit, and the file path to an appropriate image, precipitation in inches, and wind in MPH
 */
function getHourlyForecastObject(requestResult, requestedHour) {
    if (requestedHour > 23) {
        requestedHour -= 24;
    }

    const requestedHourObject = requestResult.forecast.forecastday[0].hour[requestedHour];

    return {
        hour: requestedHour,
        temp_C: requestedHourObject.temp_c,
        temp_F: requestedHourObject.temp_f,
        imagePath: getImagePath(requestedHourObject.condition.code, getIsDay(requestedHourObject.time)),
        precipitation: requestedHourObject.precip_in,
        wind: requestedHourObject.wind_mph
    };
}