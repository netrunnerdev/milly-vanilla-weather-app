// --- GLOBAL VARIABLES ---
let celsiusTemperature = null;
let currentCityTimezoneOffset = null;
let timeInterval = null;

// --- TIME & DATE FORMATTING ---
function formatLocalTime(timezoneOffset) {
  let now = new Date();
  let utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  let cityTime = new Date(utcTime + timezoneOffset * 1000);

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[cityTime.getDay()];
  let hours = cityTime.getHours();
  let minutes = cityTime.getMinutes();
  let seconds = cityTime.getSeconds(); 

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${day} ${hours}:${minutes}:${seconds}`;
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
    "03
