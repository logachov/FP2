let apiKey = "c110ea55f9fc67bbe11e8618e106eff8";
let tempC = null;
let humValue = null;
let windValue = null;
let time = null;
let setDate = document.querySelector(".currentTime");
let coordF = null;
let currentName = null;
let favCities = null;
let currentCity = document.querySelector("p.currentCity");
let visible = document.querySelector(".currentTemp");
let unvisible = document.querySelector(".hiddenTemp");
let tempInF = document.querySelector("span.TempF");
let tempInС = document.querySelector("span.TempC");
let searchCity = document.querySelector(".search");
let humidity = document.querySelector("p.humidity");
let wind = document.querySelector("p.wind");
let description = document.querySelector("p.currentDescription");
let currentPicture = document.querySelector(".currentPicture");

function currentData(anyDate) {
  let realTime = new Date(anyDate);
  let hours = realTime.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = realTime.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let day = realTime.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let fullDay = days[day];
  let result = `Valid for ${fullDay} ${hours}:${minutes} `;
  return result;
}

function shortDay(anyDate) {
  let date = new Date(anyDate * 1000);
  let day = date.getDay();
  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekDays[day];
}

favCities = document.querySelectorAll(".favorites");

function showFavCity(event) {
  search(event.target.id);
}
Array.from(favCities).forEach(function (city) {
  city.addEventListener("click", showFavCity);
});

function forecastCtoF() {
  let max = document.querySelectorAll(".tempMax");
  let min = document.querySelectorAll(".tempMin");
  max.forEach(function (temp) {
    let tempMx = parseInt(temp.innerText);
    temp.innerHTML = `${Math.round((tempMx * 9) / 5 + 32)}&degF`;
  });
  min.forEach(function (temp) {
    let tempMn = parseInt(temp.innerText);
    temp.innerHTML = `${Math.round((tempMn * 9) / 5 + 32)}&degF`;
  });
}

function setCity(event) {
  event.preventDefault();
  let cityName = document.querySelector("#search");
  if (cityName.value.length > 0) {
    search(cityName.value);
    cityName.value = "";
  }
}
searchCity.addEventListener("click", setCity);

/////////////////////////////////////////////////////////////////////////////
// I could not hang an event on dynamically created elements without jQuery /
/////////////////////////////////////////////////////////////////////////////
/* let addFavCity = document.querySelector(".add");

function addCity(event) {
  event.preventDefault();
  let rowCities = document.querySelector(".cities");
  let fCities = document.querySelectorAll(".favorites");
  let newCity = `
      <div class="col favorites" id="${currentName}">
        ${currentName}
      </div>`;
  if (fCities.length < 5) {
    rowCities.insertAdjacentHTML("beforeend", newCity);
  }
  favCities = document.querySelectorAll(".favorites");
  console.log(favCities);
}
addFavCity.addEventListener("click", addCity); */
/////////////////////////////////////////////////////////////////////////////

function showForecast(response) {
  let forecastData = response.data.daily;

  let forecastIns = document.querySelector("#group");

  let toHTML = "";
  forecastData.forEach(function (setData, index) {
    if (index < 5) {
      toHTML += `<div class="btn-group">
    <div class="col card-cont">
      <div class="card">
        <p class="card-text days day1">${shortDay(setData.dt)}</p>
        <p class="card-title">
          <span class="tempMax"> ${Math.round(setData.temp.max)}&degC</span>
          <span class="tempMin"> ${Math.round(setData.temp.min)}&degC</span>
        </p>
        <p class="card-text">
          <img
          src="http://openweathermap.org/img/w/${setData.weather[0].icon}.png"
          alt="${setData.weather[0].main}"
          width="42"
        />
        </p>
      </div>
    </div>
  </div>`;
    }
  });

  forecastIns.innerHTML = toHTML;
}

function addForecast(coord) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function search(cityName) {
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(showData);
}

function myPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showData);
}

let currentPlace = document.querySelector(".current");
function setPlace(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(myPosition);
}
currentPlace.addEventListener("click", setPlace);

function showData(response) {
  if (response.status === 200) {
    let city = response.data.name;
    currentName = city;
    time = response.data.dt * 1000;
    setDate.innerHTML = currentData(time);
    tempC = Math.round(response.data.main.temp);
    tempInС.innerHTML = tempC;
    currentCity.innerHTML = city;
    description.innerHTML = response.data.weather[0].description;
    humValue = `Humidity ${response.data.main.humidity}%`;
    humidity.innerHTML = humValue;
    windValue = `Wind ${Math.round(response.data.wind.speed)} m/c`;
    wind.innerHTML = windValue;
    let icon = response.data.weather[0].icon;
    let alt = response.data.weather[0].main;
    currentPicture.setAttribute(
      "src",
      `http://openweathermap.org/img/w/${icon}.png`
    );
    currentPicture.setAttribute("alt", alt);
    startC();
    coordF = response.data.coord;
  }
  addForecast(response.data.coord);
}

function setTempF(event) {
  event.preventDefault();
  if (unvisible.classList.contains("hiddenTemp")) {
    unvisible.classList.add("currentTemp");
    visible.classList.remove("currentTemp");
    visible.classList.add("hiddenTemp");
    unvisible.classList.remove("hiddenTemp");
    tempInF.innerHTML = Math.round((tempC * 9) / 5 + 32);
    let humidityF = document.querySelector("p.humidityF");
    let windF = document.querySelector("p.windF");
    humidityF.innerHTML = humValue;
    windF.innerHTML = windValue;
  }
  forecastCtoF();
}
visible.addEventListener("click", setTempF);

function setTempC(event) {
  event.preventDefault();
  addForecast(coordF);
  startC();
}
unvisible.addEventListener("click", setTempC);

function startC() {
  unvisible.classList.remove("currentTemp");
  visible.classList.add("currentTemp");
  visible.classList.remove("hiddenTemp");
  unvisible.classList.add("hiddenTemp");
}

search("Amsterdam");
