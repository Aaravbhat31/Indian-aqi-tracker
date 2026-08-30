document.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("citySelect");
  const fetchBtn = document.getElementById("fetchBtn");

  // Initial load for Delhi
  fetchData(28.6139, 77.2090, "Delhi (NCR)");
  loadHealthNews();

  fetchBtn.addEventListener("click", () => {
    const [lat, lon] = citySelect.value.split(",");
    const cityName = citySelect.options[citySelect.selectedIndex].text;
    fetchData(lat, lon, cityName);
  });
});

// Fetch Live AQI & Weather from Open-Meteo (Free, No API Key Required)
async function fetchData(lat, lon, name) {
  document.getElementById("cityName").innerText = name;
  document.getElementById("aqiStatus").innerText = "Updating...";

  try {
    // Air Quality API Call
    const aqiRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`
    );
    const aqiData = await aqiRes.json();
    
    // Weather API Call
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index`
    );
    const weatherData = await weatherRes.json();

    updateUI(aqiData.current, weatherData.current);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("aqiStatus").innerText = "Error loading data";
  }
}

// Render Data on UI
function updateUI(aqi, weather) {
  const usAqi = Math.round(aqi.us_aqi);
  
  document.getElementById("aqiValue").innerText = usAqi;
  document.getElementById("pm25").innerText = `${aqi.pm2_5} µg/m³`;
  document.getElementById("pm10").innerText = `${aqi.pm10} µg/m³`;
  document.getElementById("no2").innerText = `${aqi.nitrogen_dioxide} µg/m³`;
  document.getElementById("o3").innerText = `${aqi.ozone} µg/m³`;

  document.getElementById("tempValue").innerText = Math.round(weather.temperature_2m);
  document.getElementById("humidity").innerText = `${weather.relative_humidity_2m}%`;
  document.getElementById("windSpeed").innerText = `${weather.wind_speed_10m} km/h`;
  document.getElementById("uvIndex").innerText = weather.uv_index;

  // AQI Category Status & Advice
  const statusElem = document.getElementById("aqiStatus");
  const descElem = document.getElementById("aqiDesc");
  const maskAdvice = document.getElementById("maskAdvice");
  const outdoorAdvice = document.getElementById("outdoorAdvice");
  const indoorAdvice = document.getElementById("indoorAdvice");

  if (usAqi <= 50) {
    statusElem.innerText = "Good";
    statusElem.style.backgroundColor = "#10b981";
    descElem.innerText = "Air quality is satisfactory, and air pollution poses little or no risk.";
    maskAdvice.innerText = "No mask required. Enjoy clean air!";
    outdoorAdvice.innerText = "Ideal condition for outdoor exercise and activities.";
    indoorAdvice.innerText = "Good time to ventilate your home with fresh air.";
  } else if (usAqi <= 100) {
    statusElem.innerText = "Moderate";
    statusElem.style.backgroundColor = "#f59e0b";
    descElem.innerText = "Air quality is acceptable. Sensitive individuals may experience mild irritation.";
    maskAdvice.innerText = "Masks optional; recommended only for highly sensitive individuals.";
    outdoorAdvice.innerText = "Unrestricted outdoor activities for most people.";
    indoorAdvice.innerText = "Keep windows open unless you notice irritation.";
  } else if (usAqi <= 150) {
    statusElem.innerText = "Unhealthy for Sensitive Groups";
    statusElem.style.backgroundColor = "#f97316";
    descElem.innerText = "Members of sensitive groups may experience health effects.";
    maskAdvice.innerText = "N95 masks recommended for elders, children, and asthmatics.";
    outdoorAdvice.innerText = "Reduce prolonged outdoor exertion if experiencing symptoms.";
    indoorAdvice.innerText = "Close windows to reduce outdoor pollution entrance.";
  } else if (usAqi <= 200) {
    statusElem.innerText = "Unhealthy";
    statusElem.style.backgroundColor = "#ef4444";
    descElem.innerText = "Everyone may begin to experience health effects.";
    maskAdvice.innerText = "N95 or KN95 masks strongly advised outdoors.";
    outdoorAdvice.innerText = "Avoid intense outdoor exercise. Take frequent breaks inside.";
    indoorAdvice.innerText = "Run air purifiers indoors and keep windows closed.";
  } else {
    statusElem.innerText = "Very Unhealthy / Severe";
    statusElem.style.backgroundColor = "#881337";
    descElem.innerText = "Health alert: Everyone may experience more serious health effects.";
    maskAdvice.innerText = "Mandatory N95 mask usage whenever stepping outdoors.";
    outdoorAdvice.innerText = "Avoid all outdoor physical activities.";
    indoorAdvice.innerText = "Use air purifiers on high mode and seal window gaps.";
  }
}

// Load Health & Environment News Articles
function loadHealthNews() {
  const news = [
    {
      title: "Understanding PM2.5 and Its Impact on Respiratory Health",
      desc: "Learn how microscopic particulate matter penetrates deep into lungs and blood vessels, and how to protect yourself.",
      link: "https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health"
    },
    {
      title: "How to Choose the Right Air Purifier for Indian Homes",
      desc: "HEPA filters vs Ionizers: Key features to look for when buying an air purifier to combat indoor pollution.",
      link: "https://www.cpcb.nic.in"
    },
    {
      title: "Nutrition Tips to Boost Immunity Against Air Pollution",
      desc: "Dietitians recommend antioxidants, vitamin C, and omega-3 rich foods to fight inflammation caused by toxic smog.",
      link: "https://www.mohfw.gov.in"
    }
  ];

  const newsGrid = document.getElementById("newsGrid");
  newsGrid.innerHTML = news
    .map(
      (item) => `
    <div class="news-card">
      <div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
      <a href="${item.link}" target="_blank">Read Article <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </div>
  `
    )
    .join("");
}