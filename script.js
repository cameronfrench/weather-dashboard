var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city');
var currentContainerEl = document.querySelector('#current-forecast-container');
var citySearchTerm = document.querySelector('#city-search-term');
var searchHistory = JSON.parse(localStorage.getItem("cities"))||[]
var buttonLimit = 5;
var numberOfButtons = Math.min(buttonLimit, searchHistory.length); 

// builds out previously search history and retreives that data when clicked
if (searchHistory.length > 0) {
  for (var i = 0; i < numberOfButtons; i++) {
    var cityButton = document.createElement("button")
    cityButton.textContent = searchHistory[i]
    cityButton.classList.add("btn")
    cityButton.setAttribute("data-language", searchHistory[i])
    cityButtonsEl.appendChild(cityButton)
  }
}
// The primary function to capture city name, determine if it's valid, and if valid, run the get currentWeather function. 
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = cityInputEl.value;

  if (cityname) {
    searchHistory.push(cityname)
    localStorage.setItem("cities", JSON.stringify(searchHistory)) 
    getCurrentWeather(cityname);
    getFiveDay(cityname); 

    currentContainerEl.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter a valid city name');
  }
};

// This function will be used to regenerate previously searched cities. Can I have this rerun the getCurrentWeather function? 
var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getCurrentWeather(language);

    currentContainerEl.textContent = '';
  }
};

var getCurrentWeather = function (city) {
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city  + '&limit=1&appid=0e99ce2bf674f4d3c3a3a85697c471a6&units=imperial' 

fetch(apiUrl)
    .then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
        // Extract the necessary weather information from the 'data' object
        console.log(data)
        var weather = data.weather;
        var temperature = data.main.temp;
        var humidity = data.main.humidity;
        var wind = data.wind.speed
        var description = data.weather[0].description;

        // Creates a string with the weather information
        var weatherInfo = '<b>Weather for ' + city + '<img src="https://openweathermap.org/img/wn/' + data.weather[0].icon +'@2x.png"/><br></b>';
        weatherInfo += 'Temperature: ' + temperature + '°F<br>';
        weatherInfo += 'Humidity: ' + humidity + '%<br>';
        weatherInfo += 'Wind Speed: ' + wind + 'MPH<br>';
        weatherInfo += 'Description: ' + description + '<br>';
        

        // Display the weather information in an HTML element
        var weatherContainer = document.getElementById('current-forecast-container');
        weatherContainer.innerHTML = '<div class="weather-container">' + weatherInfo + '</div>';
        });
    } else {
        alert('Error: ' + response.statusText);
    }
    })
    .catch(function (error) {
    alert('Unable to retrieve current weather data');
    });
};

var indicesToPull = [0, 6, 14, 22, 30];

var getFiveDay = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=0e99ce2bf674f4d3c3a3a85697c471a6&units=imperial';

  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          // Extract the necessary weather information from the 'data' object
          var fiveDayList = data.list.filter(function (item, index) {
            return indicesToPull.includes(index);
          });
          console.log(fiveDayList);

          // Iterate over the fiveDayList array to fetch the required information for each item
          
          var weatherInfo = 'Weather for ' + city + '<br>';
          for (var i = 0; i < fiveDayList.length; i++) {
            var date = fiveDayList[i].dt_txt;
            var tempMax = fiveDayList[i].main.temp_max;
            var tempMin = fiveDayList[i].main.temp_min;
            var humidity = fiveDayList[i].main.humidity;
            var wind = fiveDayList[i].wind.speed;
            var description = fiveDayList[i].weather[0].description;
            var icon = fiveDayList[i].weather[0].icon

            var iconLink = '<img src="https://openweathermap.org/img/wn/' + icon +'@2x.png"/><br></b>';
            
            weatherInfo += 'Date: ' + date + '<br>';
            weatherInfo += iconLink + '<br>'; 
            weatherInfo += 'High: ' + tempMax + '°F<br>';
            weatherInfo += 'Low: ' + tempMin + '°F<br>';
            weatherInfo += 'Humidity: ' + humidity + '%<br>';
            weatherInfo += 'Wind Speed: ' + wind + 'MPH<br>';
            weatherInfo += 'Description: ' + description + '<br>';
            weatherInfo += '<br>';
          }

          // Display the weather information in an HTML element
          var weatherContainer = document.getElementById('five-day-container');
          weatherContainer.innerHTML = '<div class="weather-info">' + weatherInfo + '</div>';
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert('Unable to retrieve current weather data');
    });
};


cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
