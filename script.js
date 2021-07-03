var api = "https://api.openweathermap.org/data/2.5/onecall";
var api_key_url = config.api_key_url;

//Function to read the json file
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var city_list;
readTextFile("./city_list.json", function(text){
    city_list = JSON.parse(text);
});


//Function to Convert Unix time to date
function convertUnixToDate(unix){
    var a = new Date(unix * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var todayDate = date + ' ' + month + ' ' + year;

    return todayDate;
}

//Function to Convert Unix time to real time
function convertUnixToTime(unix){

    var a = new Date(unix * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time= hour + ':' + min + ':' + sec;

    return time;
}

//Updating Weather
function UpdateWeather(jsonResponse,city,country) {

    var date = convertUnixToDate(jsonResponse.current.dt);
    var time = convertUnixToTime(jsonResponse.current.dt);
    var temp = (jsonResponse.current.temp - 273.15).toFixed(2);
    var main = jsonResponse.current.weather[0].main;

    // document.querySelector(".date").innerHTML = date;
    // document.querySelector(".temp").innerHTML = temp+ String.fromCharCode(176) + 'C' ;
    // document.querySelector(".main-weather").innerHTML = main;
    // document.querySelector(".place").innerHTML = city + ',' + country;

    $('.Lower-div').remove();

    $('.current-weather').css({
        height : '550px'
     });

    $('<div class="Lower-div">'+
    '<div class="place">'+
        `${city}` + ',' + `${country}`+
    '</div>' + 
    '<div class="date">'+
        `${date}` +  
    '</div>' + 
   '<div class="temp">' + 
        `${temp}&degC
    </div>
     <div class="main-weather">
        ${main}
     </div>
     </div>`).appendTo('.current-weather');
    //Week Weather 

    $('#weather-forecast').empty();
    for(let i = 1; i<jsonResponse.daily.length; i++){
        let date =  convertUnixToDate(jsonResponse.daily[i].dt);

        let img = 'https://openweathermap.org/img/wn/' + `${jsonResponse.daily[i].weather[0].icon}`+ '@2x.png';

        let min = (jsonResponse.daily[i].temp.min - 273.15).toFixed(2);

        let max = (jsonResponse.daily[i].temp.max - 273.15).toFixed(2);

        $('<div class="weather-forecast-item item">' +
        '<div class="day">' + 
            `${date}` + 
        '</div>' + 
        '<div class="image">' + 
            `<img src="${img}" alt="">`+
        '</div>' + 
        '<div class="temp">' + 
           `${min}&degC (min) / ${max}&deg (max)` + 
        '</div>' +
    
        '</div>').appendTo('#weather-forecast');
        
    }
}

function FetchData(){
    var xhrRequest = new XMLHttpRequest();

    var city = document.querySelector(".input").value;

    city = (city.charAt(0).toUpperCase() + city.slice(1));
    let lat,lon,country;
    for(let i = 0;i<city_list.length;i++){
         if(city==city_list[i].name){
             lat = city_list[i].coord.lat;
             lon = city_list[i].coord.lon;
             country = city_list[i].country;
             break;
         }       
    }

    if(!lat){
        alert("City not found");
        return;
    }

    xhrRequest.onload = function(){

        var jsonResponse = JSON.parse(xhrRequest.response);

        if(jsonResponse.message=="city not found"){
            alert("City Not Found");
            return;
        }

        
        UpdateWeather(jsonResponse,city,country);   
    }

    var api_link = api+"?lat="+lat+ "&lon="+lon + "&exclude=hourly,minutely"+"&apppid="+api_key_url;
    xhrRequest.open('get',api_link,true);
    xhrRequest.send();
}

var button = document.querySelector(".button");

button.addEventListener("click",FetchData);