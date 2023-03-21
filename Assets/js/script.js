//require("dotenv").config()
const apiKey = "f23dd9e875745005f7b826db1c789cea" 
let searchedTime = document.querySelector('#searchedTime');
let currentWeather =document.querySelector('#weatherInfo');
let searchBtn = document.querySelector(`#searchBtn`);
let searchedCity = document.querySelector('#searchedCity');
let weatherCards = document.querySelector('#weatherCards');
let searchHistory = document.querySelector('#searchHistory');


async function geoWeatherData(lat, lon){

    const coordSearchUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(coordSearchUrl)
    const coordCityData = await response.json()
    console.log(coordCityData)

    for(let i = 7; i < coordCityData.list.length; i += 8){
        console.log(coordCityData.list[i]);
        console.log(coordCityData.list[i].dt_txt)
        let card = document.createElement('div');
        card.classList.add("card");
        let date = dayjs.unix(coordCityData.list[i].dt).format('MM/DD/YY')
        //console.log(date);
        let dateCardTitle = document.createElement('h3');
        dateCardTitle.innerText = date;
        card.appendChild(dateCardTitle);
        let imageUrl = ` https://openweathermap.org/img/wn/${coordCityData.list[i].weather[0].icon}@2x.png`
        console.log(imageUrl);
        let weatherIcon = document.createElement('img')
        weatherIcon.src = imageUrl;
        card.appendChild(weatherIcon);
        let Temp = coordCityData.list[i].main.temp;
        console.log(Temp + '°F')
        let cardTemp = document.createElement('p');
        cardTemp.innerText = "Temp: " + Temp + '°F';
        card.appendChild(cardTemp);
        let wind = coordCityData.list[i].wind.speed;
        console.log(wind);
        let cardWind = document.createElement('p');
        cardWind.innerText= "wind: " + wind + 'MPH';
        card.appendChild(cardWind);
        let humidity = coordCityData.list[i].main.humidity;
        console.log(humidity);
        let cardHumidity = document.createElement('p');
        cardHumidity.innerText = "humidity: " + humidity + "%"
        card.appendChild(cardHumidity);
        // this line comes last 
        weatherCards.appendChild(card);
       
    }

    return coordCityData;
    

};

function renderSearches(citiesSearched){
    searchHistory.innerText = "";
    for (let i = 0; i < citiesSearched.length; i++){
        let citySearch = document.createElement("li");
        citySearch.innerText = citiesSearched[i];
        searchHistory.appendChild(citySearch);
    }
    

}

window.addEventListener("DOMContentLoaded", function(){

    let savedSearches = localStorage.getItem("savedCities");
    console.log(savedSearches);
    if(savedSearches){
        savedSearches = JSON.parse(savedSearches);
        renderSearches(savedSearches);
    }
})
searchBtn.addEventListener('click',function(event){
    event.preventDefault();
    weatherCards.innerText = "";
    
    let cityName = document.querySelector(`#searchText`).value;
   
    const citySearchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    
    //console.log(cityName);
    fetch(citySearchUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        //console.log(data)
        if (data.cod === 200){
            console.log(data.weather[0].icon)
            console.log(data.dt);
            var date = new Date(data.dt * 1000).toLocaleString();
            dateOnly = date.split(",")
            console.log(dateOnly);
            let savedSearches = localStorage.getItem("savedCities");
            console.log(savedSearches)
            if (!savedSearches){
                savedSearches = [];
                
            } else{
                console.log(savedSearches);
                console.log(typeof savedSearches);
                savedSearches = JSON.parse(savedSearches)
            }
            
            savedSearches.unshift(cityName);
            savedSearches = savedSearches.slice(0,5);
            let extra = [];
            // for(let i =0; i < savedSearches.length; i++){
            //     if(i < 5){
            //         extra.push(savedSearches[i])
                    
            //     }
            // }
            localStorage.setItem("savedCities", JSON.stringify(savedSearches));
            renderSearches(savedSearches);
          
        searchedCity.textContent = cityName;
        let currentDate = document.createElement('p');
        currentDate.textContent = dateOnly[0];
        searchedCity.appendChild(currentDate);
        let tempToday = data.main.temp;
        console.log(tempToday);
        let tempInfo = document.createElement('p');
        tempInfo.innerText = "Temp: " + tempToday +"°F";
        searchedCity.appendChild(tempInfo);
        let windToday = data.wind.speed;
        let windInfo = document.createElement('p');
        windInfo.innerText = "Wind: " + windToday + "MPH";
        searchedCity.appendChild(windInfo);
        let humidityToday = data.main.humidity;
        let humidityInfo = document.createElement('p')
        humidityInfo.innerText = "Humidity: " + humidityToday + "%";
        searchedCity.appendChild(humidityInfo);
        let iconId = data.weather[0].icon;
        console.log(iconId);
        let imgUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
        let weatherImg = document.createElement("img");
        weatherImg.src = imgUrl
        searchedCity.appendChild(weatherImg);
        geoWeatherData(data.coord.lat, data.coord.lon);
        }
    })
})


