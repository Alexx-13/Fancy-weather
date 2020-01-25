// SELECT ELEMENTS
let iconElement = document.querySelector(".weather-icon");
let tempElement = document.querySelector(".temperature-value p");
let descElement = document.querySelector(".temperature-description p");
let locationElement = document.querySelector(".location p");
let notificationElement = document.querySelector(".notification");
let switchElement = document.querySelector(".switch p");
let longitudeElement = document.querySelector(".longitude");
let latitudeElement = document.querySelector(".latitude");
let timeElement = document.querySelector(".time");
let humidityElement = document.querySelector(".humidity");
let windElement = document.querySelector(".wind");
// App data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;

// API KEY
const key = "fc47b124b23826ea2b0314bd42e64f80";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);


}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}



// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
            
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.longitude = data.coord.lon;
            weather.latitude = data.coord.lat;
            weather.time = data.dt;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;

        })
        .then(function () {
            displayWeather();
        });
        
}
// DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    longitudeElement.innerHTML = `${weather.longitude}` + ' longitude';
    latitudeElement.innerHTML = `${weather.latitude}` + ' latitude';
    timeElement.innerHTML = `${weather.time}`;
    humidityElement.innerHTML = `${weather.humidity}` + ' humidity';
    windElement.innerHTML = `${weather.wind}` + ' m/s wind speed';


}



// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE BUTTON
switchElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});


// WHEN THE USER CLICKS ON THE BACKGROUND BUTTON
window.onload = function  () {
    var button = document.getElementById('input_button_bg_change');
    var body = document.getElementsByTagName('body')[0];
    var images = ['url("images/image1.jpg")', 'url("images/image2.jpg")', 'url("images/image3.jpg")', 'url("images/image4.jpg")', 'url("images/image5.jpg")', 'url("images/image6.jpg")'
        , 'url("images/image7.jpg")', 'url("images/image8.jpg")', 'url("images/image9.jpg")', 'url("images/image10.jpg")'];    
    document.body.style.backgroundImage = images[Math.floor(Math.random() * images.length)];
    button.onclick = function back () {
        body.style.backgroundImage = images[Math.floor(Math.random() * images.length)];
    };
};
  

// SEARCH INPUT
let searchMethod;

function getSearchMethod(searchTerm) {
    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q';
}

function searchWeather(searchTerm) {
    getSearchMethod(searchTerm);
    fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&appid=${key}`).then(result => {
        return result.json();
    }).then(result => {
        init(result);
    })
}

function init(resultFromServer) {
    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = 'url("images/Clear.jpg")';
            break
        case 'Clouds':
            document.body.style.backgroundImage = 'url("images/Clouds.jpg")';
            break
        case 'Thuderstorm':
            document.body.style.backgroundImage = 'url("images/Thunderstorm.jpg")';
            break
        case 'Snow':
            document.body.style.backgroundImage = 'url("images/Snow.jpg")';
            break
        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            document.body.style.backgroundImage = 'url("images/Mist.jpg")';
            break


    }

    const celsiusTemperature = Math.floor(resultFromServer.main.temp - KELVIN)

    let resultDescription = resultFromServer.weather[0].description;
    

    iconElement.innerHTML = `<img src="icons/${resultFromServer.weather[0].icon}.png"/>`
    descElement.innerHTML = resultDescription;
    tempElement.innerHTML = celsiusTemperature + '°<span>C</span>';
    locationElement.innerHTML = resultFromServer.name + ',' + resultFromServer.sys.country;
    longitudeElement.innerHTML = resultFromServer.coord.lon + ' longitude';
    latitudeElement.innerHTML = resultFromServer.coord.lon + ' latitude';
    humidityElement.innerHTMl = resultFromServer.main.humidity + ' humidity';
    windElement.innerHTML = resultFromServer.wind.speed + ' m/s wind speed';
    timeElement.innerHTML = resultFromServer.dt;

    
    // C to F conversion
    function celsiusToFahrenheit(temperature) {
        return (temperature * 9 / 5) + 32;
    }

    // WHEN THE USER CLICKS ON THE TEMPERATURE BUTTON
    
    switchElement.addEventListener("click", function () {
        if (resultFromServer.main.temp === undefined) return;

        if (resultFromServer.main.unit == "celsius") {
            console.log(resultFromServer.main.temp);
            let fahrenheit = celsiusToFahrenheit(celsiusTemperature);
            fahrenheit = Math.floor(fahrenheit);

            tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
            resultFromServer.main.unit = "fahrenheit";
        } else {
            tempElement.innerHTML = `${celsiusTemperature}°<span>C</span>`;
            resultFromServer.main.unit = "celsius"
        }
    });
    drawMap(resultFromServer.coord.lon, resultFromServer.coord.lat);

}
///// SEARCH BUTTON
document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if (searchTerm)
        searchWeather(searchTerm);
})

function keyPress(e) {
    if (e) keyCode = e.which;
    else if (event) keyCode = event.keyCode;
    else return;
    if (keyCode == 13) document.getElementById('searchBtn').click();
}
document.onkeypress = keyPress;


