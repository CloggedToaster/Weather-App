const fetchLocation = async(cityName) => {
    const baseURL = "https://geocoding-api.open-meteo.com/v1/search?";
    const nameParameter ="name="+cityName;
    const languageParameter = "&language=en";
    const formatParameter = "&format=json";
    const apiQuery = baseURL+nameParameter+languageParameter+formatParameter;
    
    const apiResponse = await fetch(apiQuery);
    const json = await apiResponse.json();
    
    if(!json.results){
        return {
            "error": true,
        };
    }
    
    let latitude = json.results[0].latitude;
    let longitude = json.results[0].longitude;
    let country = json.results[0].country;
    let admin1 = json.results[0].admin1;
    let location = admin1+", "+country;

    return {
        "latitude": latitude, 
        "longitude": longitude, 
        "cityName": cityName, 
        "location": location,
    };
}

const fetchWeather = async(latitude, longitude) => {
    const baseURL = "https://api.open-meteo.com/v1/forecast?";
    const latitudeParameter = "latitude="+latitude;
    const longitudeParameter = "&longitude="+longitude;
    const weatherVariableParameters = "&current=temperature_2m,weather_code,cloud_cover";
    const temperatureUnitParameter = "&temperature_unit=fahrenheit";
    const windSpeedunit = "&wind_speed_unit=mph";
    const preciptationUnitParameter = "&precipitation_unit=inch";
    const apiQuery = baseURL+latitudeParameter+longitudeParameter+weatherVariableParameters+temperatureUnitParameter+windSpeedunit+preciptationUnitParameter;

    const apiResponse = await fetch(apiQuery);
    const json = await apiResponse.json();

    let temperature = json.current.temperature_2m;
    let temperatureUnit = json.current_units.temperature_2m;

    let weatherCode = json.current.weather_code;
    let weatherCodeUnit = json.current_units.weather_code;
    let cloudCoverage = json.current.cloud_cover;
    let cloudCoverageUnit = json.current_units.cloud_cover;

    return {
        "temperature":temperature,
        "temperatureString":temperature+temperatureUnit,
        "weatherCode":weatherCode,
        "weatherCodeString":weatherCodeUnit+" "+weatherCode,
        "cloudCoverage":cloudCoverage,
        "cloudCoverageString":cloudCoverage+cloudCoverageUnit,
    };
}

const printCityData = async () => {
    const cityName = document.querySelector("#cityField").value;
    fetchLocation(cityName)
    .then(locationResponse => {
        if(locationResponse.error){
            return{
                "error": true,
            };
        }
        fetchWeather(locationResponse.latitude, locationResponse.longitude)
        .then(weatherResponse => {
            console.log(weatherResponse.temperature);
            console.log(weatherResponse.weatherCode);
            console.log("Cloud Coverage: "+weatherResponse.cloudCoverage);
        });
        const latitudeString = Math.abs(locationResponse.latitude)+(locationResponse.latitude>0?"° N":"° S");
        const longitudeString = Math.abs(locationResponse.longitude)+(locationResponse.longitude>0?"° E":"° W");
        const locationString = cityName+", "+locationResponse.location;
        
        console.log(latitudeString+", "+longitudeString);
        console.log(locationString);
        return{
            "error": false,
        };
    })
    .then(response => {
        if(response.error){
            console.log("City does not exist!");
        }
    });
}

const fetchAllData = async (cityName) => {
    let data = {};
    const locationData = await fetchLocation(cityName);
    const weatherData = await fetchWeather(locationData.latitude, locationData.longitude);

    weatherData.latitudeString = String(Math.abs(locationData.latitude)).substring(0, 5) + (locationData.latitude>0?"° N":"° S");
    weatherData.longitudeString = String(Math.abs(locationData.longitude)).substring(0, 5) + (locationData.longitude>0?"° E":"° W");
    weatherData.locationString = cityName+", "+locationData.location;

    data = {...locationData, ...weatherData};
    console.log(data)
    return data;
}

// Event Listeners
window.addEventListener("DOMContentLoaded", (event) => {
    if(localStorage.getItem('cityName')){
        fetchAllData(localStorage.getItem('cityName'))
        .then(res => {
            const cityNameDiv = document.querySelector("#cityNameDiv");
            
            const cityNameHeader = document.querySelector("#cityNameHeader");
            const temperatureHeader = document.querySelector("#temperatureHeader");
            const coordinateHeader = document.querySelector("#coordinateHeader");
            
            cityNameHeader.innerText = res.locationString;
            temperatureHeader.innerText = res.temperatureString;
            coordinateHeader.innerText = res.latitudeString + ", " + res.longitudeString;
        })
    }

    const cityForm = document.querySelector("#cityForm");
    const cityField = document.querySelector("#cityField");
    if(cityForm) {
        cityForm.addEventListener("submit", handleFormSubmit, false);
    }
});

const handleFormSubmit = (event) => {
    event.preventDefault();

    fetchAllData(cityField.value)
    .then(res => {
        localStorage.setItem('cityName', cityField.value);

        const cityNameDiv = document.querySelector("#cityNameDiv");
        
        const cityNameHeader = document.querySelector("#cityNameHeader");
        const temperatureHeader = document.querySelector("#temperatureHeader");
        const coordinateHeader = document.querySelector("#coordinateHeader");
        
        cityNameHeader.innerText = res.locationString;
        temperatureHeader.innerText = res.temperatureString;
        coordinateHeader.innerText = res.latitudeString + ", " + res.longitudeString;
    })
}
  
const clearLocalStorage = () => {
    localStorage.clear();   
}

const handleDarkMode = () => {
    const ele = document.body;
    ele.classList.toggle('dark-mode');
}