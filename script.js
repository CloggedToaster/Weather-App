const fetchLocation = async(cityName) => {
    const baseURL = "https://geocoding-api.open-meteo.com/v1/search?";
    const nameParameter ="name="+cityName;
    const languageParameter = "&language=en";
    const formatParameter = "&format=json";
    const apiQuery = baseURL+nameParameter+languageParameter+formatParameter;
    
    const apiResponse = await fetch(apiQuery);
    const json = await apiResponse.json();

    let latitude = json.results[0].latitude;
    let longitude = json.results[0].longitude;
    let country = json.results[0].country;
    let admin1 = json.results[0].admin1;
    let location = admin1+", "+country;

    return {
        "latitude": latitude, 
        "longitude": longitude, 
        "cityName": cityName, 
        "location": location
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
        "temperature":temperature+temperatureUnit,
        "weatherCode":weatherCodeUnit+" "+weatherCode,
        "cloudCoverage":cloudCoverage+cloudCoverageUnit
    };
}

const printCityData = async (cityName) => {
    fetchLocation(cityName)
    .then(locationResponse => {
        fetchWeather(locationResponse.latitude, locationResponse.longitude).then(weatherResponse => {
            console.log(weatherResponse.temperature);
            console.log(weatherResponse.weatherCode);
            console.log("Cloud Coverage: "+weatherResponse.cloudCoverage);
        });
        const latitudeString = Math.abs(locationResponse.latitude)+(locationResponse.latitude>0?"° N":"° S");
        const longitudeString = Math.abs(locationResponse.longitude)+(locationResponse.longitude>0?"° E":"° W");
        const locationString = cityName+", "+locationResponse.location;
        
        console.log(latitudeString+", "+longitudeString);
        console.log(locationString);
    });
}

printCityData("Melbourne");
// printCityData("Newark");
// printCityData("London");
// printCityData("Tokyo");
// printCityData("Beijing");