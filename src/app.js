// --- TIME & DATE FORMATTING ---

function formatLocalTime(timezoneOffset) {
  let now = new Date();
  let utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  let cityTime = new Date(utcTime + timezoneOffset * 1000);

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[cityTime.getDay()];
  let hours = cityTime.getHours();
  let minutes = cityTime.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// --- EMOJI FORECAST LOGIC ---

function getWeatherEmoji(iconCode) {
  let emojiMapping = {
    "01d": "☀️", "01n": "🌙",
    "02d": "⛅", "02n": "⛅",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌦️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️"
  };
  return emojiMapping[iconCode] || "🌤️";
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
              <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
              
              <!-- Changed to use the Emoji function instead of the small image -->
              <div style="font-size: 35px; margin: 10px 0;">
                ${getWeatherEmoji(forecastDay.weather[0].icon)}
              </div>
              
              <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}° </span>
                  <span class="weather-forecast-temperature-min"> ${Math.round(forecastDay.temp.min)}° </span>
              </div>
          </div>
        `;
    }
  });
  
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "ac8bbf0f4d38b464214ca76d1f3d79a4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// --- MAIN WEATHER LOGIC ---

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let localTimeElement = document.querySelector("#local-time");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  localTimeElement.innerHTML = formatLocalTime(response.data.timezone);
  
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  // TRIGGER THE NEWS FEED FOR THE SEARCHED COUNTRY
  if (response.data.sys && response.data.sys.country) {
      getCountryNews(response.data.sys.country);
  }

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "ac8bbf0f4d38b464214ca76d1f3d79a4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFarenheitTemperature(event) {
  event.preventDefault();
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Dublin City");

// --- SEARCH SUGGESTIONS ---

function suggestCities(event) {
  let query = event.target.value.trim();
  let datalist = document.querySelector("#city-suggestions");

  if (query.length > 0) {
    let apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

    axios.get(apiUrl).then(function (response) {
      datalist.innerHTML = "";

      if (response.data.results) {
        response.data.results.forEach(function (city) {
          let option = document.createElement("option");
          option.value = `${city.name}, ${city.country_code}`;
          datalist.appendChild(option);
        });
      }
    });
  } else {
    datalist.innerHTML = "";
  }
}

let cityInput = document.querySelector("#city-input");
cityInput.addEventListener("input", suggestCities);

// --- RADIO STATION LOGIC ---

let stationSelect = document.querySelector("#station-select");
let audioPlayer = document.querySelector("#audio-player");

stationSelect.addEventListener("change", function (event) {
  audioPlayer.src = event.target.value;
  audioPlayer.play();
});

// --- GLOBAL NEWS FEED LOGIC ---
// --- GLOBAL NEWS FEED LOGIC (UPDATED & FIXED) ---
function getCountryNews(countryCode) {
  let newsElement = document.querySelector("#news-list");
  newsElement.innerHTML = "<li style='font-size: 14px;'>Loading latest headlines...</li>";

  // 1. The official Google News RSS link
  let rssUrl = `https://news.google.com/rss/headlines/section/geo/${countryCode}`;
  
  // 2. We use AllOrigins to bypass web browser security blocks (CORS)
  let proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

  axios.get(proxyUrl).then(function (response) {
    // 3. Translate the raw XML data from Google into something JavaScript can read
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(response.data.contents, "text/xml");
    
    // 4. Find all the news articles ("items")
    let items = xmlDoc.querySelectorAll("item");
    let newsHTML = "";
    
    // 5. Loop through just the first 3 articles
    for (let i = 0; i < 3 && i < items.length; i++) {
      let title = items[i].querySelector("title").textContent;
      let link = items[i].querySelector("link").textContent;
      
      newsHTML += `
        <li style="margin-bottom: 12px; font-size: 14px; text-align: left; line-height: 1.4;">
            <a href="${link}" target="_blank" style="color: #212529; text-decoration: none; font-weight: 500;">
                🔹 ${title}
            </a>
        </li>
      `;
    }

    // 6. Display the news, or a backup message if the country has no news
    if (newsHTML === "") {
        newsElement.innerHTML = "<li style='font-size: 14px;'>No trending news found for this region.</li>";
    } else {
        newsElement.innerHTML = newsHTML;
    }
  }).catch(function() {
      newsElement.innerHTML = "<li style='font-size: 14px;'>News currently unavailable.</li>";
  });
}
