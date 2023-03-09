// To get weather basis on CITY: 
// const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&amp;units=metric`);

// TO get weather basis on Current Location:
// let result = await fetch(`https://api.openweathermap.org/data/2.5
// /weather?lat={latitude}&lon={longitude}&appid=${API_KEY}&units=metric`);



// async function getCurrentWeatherForaCity(city){
    
//     try{
    
//     const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//     const data=await response.json();
    
//     const temperature=document.createElement('p');
//     temperature.textContent=data.main.temp + " °C";
//     document.body.appendChild(temperature);
//     // console.log(data);
    
//     const humidity=document.createElement('p');
//     humidity.textContent=data.main.humidity;
//     document.body.appendChild(humidity);

//     const windspeed=document.createElement('p');
//     windspeed.textContent=data.wind.speed;
//     document.body.appendChild(windspeed);

//     const clouds=document.createElement('p');
//     clouds.textContent=data.clouds.all+" %";
//     document.body.appendChild(clouds);
//     }catch(e){
//         alert('Error Occured => '+e.message);
//     }
    
// }


// function getMyLatAndLong(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition((position)=>{
//            const newData=document.createElement('p');
//            let value=`Latitude => ${position.coords.latitude} 
//            Longtitude => ${position.coords.longitude}`
//            newData.textContent=value;
//            document.body.appendChild(newData); 
//         })
//     }else{
//         alert("Not Able to get your geo location");
//     }
// }

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");



// initial variables
let oldTab=userTab;
const API_KEY="cc406f471d86c2dfd481e5d34392ceb7";
oldTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(newTab){
      if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            error_404.classList.remove("active");
        }else{
            // main phele search wala tab pr tha, ab your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab mein your weather tab mein aagaya hu, toh weather bhi display
            // karna padega, so lets check local storage first for
            // coordinates if we haved saved them there
            getFromSessionStorage();
        }
      }
}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


// check if coordinates are already present in session storage
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coordinates not found
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL

    try{
       const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`); 
        const data=response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
        // HW
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    if(weatherInfo?.name==undefined){
        showError404();
        userInfoContainer.classList.remove("active");
        se
    }else{
        removeError404();

    // fetch values from weatherInfo object and put it in UI 
    cityName.innerText= weatherInfo?.name;
    // countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    // weatherInfo.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
    }
}
const error_404=document.querySelector(".error-404");
function showError404(){
    error_404.classList.add("active");
}
function removeError404(){
    error_404.classList.remove("active");
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        // HW
        alert("Not able to find lcation using naigator");
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);


const searchInput=document.querySelector("[data-SearchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
    return;
    else
    fetchSearchWeatherInfo(cityName);
});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        
    }
}
























