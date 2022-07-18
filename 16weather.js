const time = document.getElementById("time");
const date = document.getElementById("date");
const currentweatheritems = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const country = document.getElementById("country");
const weatherforecast = document.getElementById("weather-forecast");
const currenttemp = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "5a8622e269417e872393aafaf2f0235b";

setInterval(() => {
  const currentTime = new Date();
  const month = currentTime.getMonth();
  const dates = currentTime.getDate();
  const day = currentTime.getDay();
  const hours = currentTime.getHours();
  const hoursIn12HrFormat = hours >= 13 ? hours % 12 : hours;
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  time.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  date.innerHTML = days[day] + ", " + dates + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
            exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  country.innerHTML = data.lat + "N " + data.lon + "E";

  currentweatheritems.innerHTML = ` <div class="weather-items">
            <div>Humidity</div>
            <div>${humidity}</div>
          </div>

          <div class="weather-items">
             <div>pressure</div>
             <div>${pressure}</div>
          </div>

          <div class="weather-items">
              <div>wind Speed</div>
              <div>${wind_speed} </div>
          </div>

           <div class="weather-items">
              <div>sunrise </div>
              <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
            </div>
 
           <div class="weather-items">
               <div>sunset </div>
               <div>${window.moment(sunset * 1000).format("HH:mm a")} </div>
           </div>
           `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currenttemp.innerHTML = `
                   
                   <div class="other">
                       <div class="day">${window
                         .moment(day.dt * 1000)
                         .format("dddd")}</div>
                         <img width="90px" style="align-self: center;" src="http://openweathermap.org/img/wn//${
                           day.weather[0].icon
                         }@4x.png" alt="weather icon" class="w-icon">
                       <div class="temp">Night - ${day.temp.night}&#176;C</div>
                       <div class="temp">Day - ${day.temp.day}&#176;C</div>
                   </div>
                   
                   `;
    } else {
      otherDayForcast += `
                   <div class="weather-forecast-item">
                       <div class="day">${window
                         .moment(day.dt * 1000)
                         .format("ddd")}</div>
                       <img src="http://openweathermap.org/img/wn/${
                         day.weather[0].icon
                       }@2x.png" alt="weather icon" class="w-icon">
                       <div class="temp">Night - ${day.temp.night}&#176;C</div>
                       <div class="temp">Day - ${day.temp.day}&#176;C</div>
                   </div>
                   
                   `;
    }
  });

  weatherforecast.innerHTML = otherDayForcast;
}
