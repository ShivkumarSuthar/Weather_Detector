import axios from "axios";
import React, { useState } from "react";
import hazeImg from "./componets/images/haze.png";
import clearImg from "./componets/images/sun.png";
import rainyImg from "./componets/images/rain.png";
import thunderstormImg from "./componets/images/lightning.png";
import cloudyImg from "./componets/images/cloud.png";
import snowImg from "./componets/images/snow.png";
import smokeImg from "./componets/images/fog.png";
import mistImg from "./componets/images/mist.png";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [show, setShow] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const access_key = "522f195b42594d07494e433776a52faf";
      const APIURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${access_key}`;

      const response = await axios.get(APIURL);
      const data = response.data;
      console.log(data);

      if (data.main) {
        setWeatherData(data);

      } else {
        console.error("Invalid weather data format:", data);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      showWeather();
    }

  };

  const weatherGetimg = (main) => {
    const images = {
      haze: hazeImg,
      cloud: cloudyImg,
      clear: clearImg,
      rain: rainyImg,
      thunderstorm: thunderstormImg,
      Drizzle: rainyImg,
      smoke: smokeImg,
      snow: snowImg,
      mist: mistImg,
    }

    return images[main];
  };

  const showWeather = () => {

    setShow(true);
    fetchData();

  };
  const handleChange = (e) => {
    const inputValue = e.target.value.replace(/[^a-zA-Z]/g, "");
    setCity(inputValue);
  };

  const getLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`your location ${latitude} ${longitude}`);

            try {
              const geocodingApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
              const response = await axios.get(geocodingApiUrl);
              const address = response.data.address.city.toLowerCase();

              setCity(address);
              setShow(true);
              showWeather();


            } catch (error) {
              console.error("Error fetching address:", error);
            }
          },
          function (error) {
            console.error("Error getting location:", error);
          }
        );
      }
    } catch (error) {
      console.error("Geolocation has some error", error);
    }
  };



  return (
    <>
      <div className="flex flex-col justify-center  items-center h-screen bg-blue-500">
        {loading ? (
          <p>Loading...</p>
        ) : show ? (
          weatherData && weatherData.weather ? (
            <>
              <div className=" bg-slate-100   rounded-md flex flex-col justify-around  w-[380px] min-h-[480px]">
                <div className="text-black px-5  py-5 text-xl ">
                  <button onClick={() => setShow(false)}>
                    <i className="fa-solid fa-arrow-left-long pr-3"></i>
                  </button>{" "}
                  Weather App
                </div>
                <hr className="text-slate-500 bg-slate-950 border-1 border-black w-100 " />

                <img
                  src={weatherGetimg(weatherData.weather[0].description)}
                  alt={weatherData.weather[0].main}
                  className="w-32  pb-5 pt-12 mx-auto "
                />
                <h1 className="font-bold text-2xl tracking-widest mx-auto pt-3">
                  {weatherData.main.temp} °C
                </h1>
                <p className="mx-auto">{weatherData.weather[0].main}y</p>
                <p className="mx-auto py-5 text-xl">
                  <i className="fa-solid fa-location-dot text-slate-500 pb-5 text-xl px-3"></i>{" "}
                  {weatherData.name}, {weatherData.sys.country}
                </p>
                <hr className="text-slate-500 bg-slate-950 border-1 border-black w-100" />
                <div className="flex justify-evenly  ">
                  <div className="w-1/2 text-center border-r-[1px] border-black py-5">
                    <i className="fa-solid fa-moon pr-2 text-xl"></i> Night
                  </div>
                  <div className=" w-1/2 text-center py-5">
                    <i className="fa-solid fa-temperature-quarter pr-2 text-xl"></i>{" "}
                    {Math.floor((9 / 5) * weatherData.main.temp + 32)} °F
                  </div>
                </div>
              </div>
            </>
          ) : null
        ) : (
          <>
            <div className="bg-white w-[356px] h-[220px] flex flex-col justify-center items-center rounded-2xl">
              <input
                type="text"
                value={city}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="border-[1px] border-black w-[284px] h-[50px] text-center placeholder:text-xl rounded-lg px-10 text-2xl mb-2"
                placeholder="Enter your city"
              />
              <div className="flex w-[100%] items-center justify-center px-10 py-3">
                <hr className="bg-slate-950 border-1 border-black w-[40%]"></hr>
                <p className="px-3 text-xl">or</p>
                <hr className="bg-slate-950 border-1 border-black w-[40%]"></hr>
              </div>
              <button
                className="bg-blue-500 py-3 px-10 rounded-lg text-white"
                onClick={getLocation}
              >
                Get Device Location
              </button>
              <div></div>
            </div>
            <p className="text-[12px] py-3 text-white">
              (Press Enter after entering the location to search)
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default App;
