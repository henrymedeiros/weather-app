// Header Elements 
const photographerUsername = document.querySelector("#photographer-user")
// Elements
const weatherIcon = document.querySelector("#weather-icon")
const weatherElement = document.querySelector("#weather");
const locationElement = document.querySelector("#location");
const temperatureElement = document.querySelector("#temperature");
const humidityElement = document.querySelector("#humidity");
const pressureElement = document.querySelector("#pressure");
const feelsLikeElement = document.querySelector("#feels-like");
const windElement = document.querySelector("#wind");
const toggleButton = document.querySelector("#toggle-button");

// Footer Elements
const footerYear = document.querySelector("#footer-year");
const btn = document.querySelector("#btn");

// Temperature & Converter Function
let temperature = {
    value: null,
    feels_like: null,
    currentDegree: null,
};

// Trigger Convert Temperature Function 
toggleButton.addEventListener("click", () => {
    if(temperature.value==null) {
        return;
    }
    else if(toggleButton.checked){
        temperature.value = Math.round(temperature.value * (9 / 5) + 32);
        temperature.feels_like = Math.round(temperature.feels_like * (9 / 5) + 32);
        temperature.currentDegree = "F";
    }else{
        temperature.value = Math.round((temperature.value - 32) * (5 / 9));
        temperature.feels_like = Math.round((temperature.feels_like - 32) * (5 / 9));
        temperature.currentDegree = "C";
    }
    temperatureElement.querySelector("#value").innerText = temperature.value;
    feelsLikeElement.innerText = temperature.feels_like;

    document.querySelectorAll(".degree").forEach(function (el) {
        el.innerText = temperature.currentDegree;
    });
})


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCall, errorCall);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


// Treat geolocation errors
function errorCall(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            window.alert("Usuário não permitiu o uso da localização.");
            break;
        case error.POSITION_UNAVAILABLE:
            window.alert("Localização não encontrada.");
            break;
        case error.TIMEOUT:
            window.alert("Timeout.");
            break;
        case error.UNKNOWN_ERROR:
            window.alert("Erro desconhecido.");
            break;
    }
}

// 
function successCall(position) {
    let coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };
    // Get Weather using coordinates 
    const url = `https://fcc-weather-api.glitch.me/api/current?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    const fetchData = (url) => {
        fetch(url, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                handleJson(json);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    fetchData(url);

    function handleJson(json) {
        // Dynamic Data into the DOM
        weatherElement.innerText = json.weather[0].main;
        locationElement.innerText = json.name;
        temperature.value = Math.round(json.main.temp);
        temperatureElement.querySelector("#value").innerText = temperature.value;
        humidityElement.innerText = json.main.humidity;
        pressureElement.innerText = json.main.pressure;
        temperature.feels_like = Math.round(json.main.feels_like);
        feelsLikeElement.innerText = temperature.feels_like;
        windElement.innerText = json.wind.speed;
        weatherIcon.src = json.weather[0].icon;
        console.log(json)

        // Unsplash Fetch Images from using city info provided by Weather API
        let unsplash_url = `https://api.unsplash.com/search/photos?query=${json.name}%20city&client_id=CGGVJAR3dbnP9OS9KHW_lJdHhX_eLYUwD59uU1pf4KU`;
        fetch(unsplash_url, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                const randomNumber = getRandomInt(0,2)
                // get a random img
                photographerUsername.innerHTML= `<a href="${json.results[randomNumber].user.links.html}">${json.results[randomNumber].user.username}</a>`
                document.body.style.backgroundImage = `linear-gradient(rgba(4,9,30, 0.7), rgba(4,9,30, 0.7)), url(${json.results[randomNumber].urls.full})`
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

function currentYear(){
    time = new Date();
    return year = time.getFullYear();
}
footerYear.innerText = currentYear()

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

getLocation();


