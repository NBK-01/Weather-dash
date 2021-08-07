

var city="";
var citySearch = $("#search-city");
var searchBtn = $("#city-search");
var clearBtn = $("#clear-cities");
var cityCurr = $("#city-curr");
var tempCurr = $("#temp-curr");
var humCurr = $("#hum-curr");
var windCurr = $("#wind-curr");
var uvCurr = $("#uv-curr");
var sCity = [];
var apiKey = "19966323207529dcfa55ecfd3b7c51ea";

function displayWeather(event){
    event.preventDefault();
    if(citySearch.val().trim()!==""){
        city=citySearch.val().trim();
        currentWeather(city);
    }
}

$("#city-search").on("click",displayWeather);

function currentWeather(city){
    // Here we build the URL so we can get a data from server side.
    var apiURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
    $.ajax({
        url:apiURL,
        method:"GET",
    }).then(function(response){

         
        console.log(response);
        
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
      
        var date=new Date(response.dt*1000).toLocaleDateString();
       
        $(cityCurr).html(response.name +"("+date+")" + "<img src="+iconurl+">");
       

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(tempCurr).html((tempF).toFixed(2)+"&#8457");
       
        $(humCurr).html(response.main.humidity+"%");
       
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(windCurr).html(windsmph+"MPH");
        
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}



