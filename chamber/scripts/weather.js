document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '08035226c17f5a43bb22a0a3994b9ace';  // replace with your valid key
  const lat = '5.6037';  // Accra latitude
  const lon = '-0.1870'; // Accra longitude

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const tempEl = document.querySelector('.temperature');
  const conditionEl = document.querySelector('.condition');
  const humidityEl = document.querySelector('.humidity');
  const windEl = document.querySelector('.wind');
  const iconEl = document.querySelector('.weather-icon-container');
  const forecastContainer = document.querySelector('.forecast-days');

  async function loadWeather() {
    try {
      // Load current weather
      const currentResp = await fetch(currentUrl);
      if (!currentResp.ok) throw new Error(`Current weather fetch failed: ${currentResp.status}`);
      const currentData = await currentResp.json();

      tempEl.textContent = `${Math.round(currentData.main.temp)}°C`;
      conditionEl.textContent = currentData.weather[0].description;
      humidityEl.textContent = `Humidity: ${currentData.main.humidity}%`;
      windEl.textContent = `Wind: ${currentData.wind.speed} km/h`;
      iconEl.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
      iconEl.alt = currentData.weather[0].description;

      // Load forecast
      const forecastResp = await fetch(forecastUrl);
      if (!forecastResp.ok) throw new Error(`Forecast fetch failed: ${forecastResp.status}`);
      const forecastData = await forecastResp.json();

      console.log('Forecast data (3h intervals):', forecastData);

      // Filter to get approximately one forecast per day (e.g. forecasts at ~12:00 each day)
      const forecastList = forecastData.list;
      if (!forecastList || forecastList.length === 0) {
        forecastContainer.innerHTML = '<p>Forecast unavailable.</p>';
        return;
      }

      // Build an array of next 3 days forecasts
      const nextDays = [];
      const today = new Date().getDate();

      // loop through forecastList, pick item where dt_txt has "12:00:00"
      for (let item of forecastList) {
        const dtTxt = item.dt_txt;  // format "YYYY‑MM‑DD HH:MM:SS"
        const date = new Date(dtTxt);
        const hour = date.getHours();
        const day = date.getDate();

        // pick forecast around midday for days after today
        if (day !== today && hour === 12) {
          nextDays.push(item);
          if (nextDays.length === 3) break;
        }
      }

      // If not enough midday forecasts, just take the first 3 after current
      if (nextDays.length < 3) {
        // fallback: pick first 3 distinct days
        const seenDays = new Set();
        for (let item of forecastList) {
          const date = new Date(item.dt_txt);
          const day = date.getDate();
          if (day !== today && !seenDays.has(day)) {
            seenDays.add(day);
            nextDays.push(item);
          }
          if (nextDays.length === 3) break;
        }
      }

      forecastContainer.innerHTML = '';  // clear previous

      nextDays.forEach(dayItem => {
        const date = new Date(dayItem.dt_txt);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = dayItem.weather[0].icon;
        const desc = dayItem.weather[0].description;
        const tempDay = Math.round(dayItem.main.temp);

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('forecast-day');
        dayDiv.innerHTML = `
          <p class="day">${weekday}</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" loading="lazy">
          <p class="temp">${tempDay}°C</p>
        `;
        forecastContainer.appendChild(dayDiv);
      });

    } catch (error) {
      console.error('Weather loading error:', error);
      forecastContainer.innerHTML = '<p>Error loading forecast.</p>';
    }
  }

  loadWeather();
});

const weatherIcon = document.createElement('img');
weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
weatherIcon.alt = currentData.weather[0].description;
weatherIcon.loading = 'lazy';
weatherIcon.classList.add('weather-icon');

iconContainer.innerHTML = ''; // clear old icon if any
iconContainer.appendChild(weatherIcon);

