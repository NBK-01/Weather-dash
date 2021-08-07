

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
        fiveDay(response.id);
        
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                historyAppend(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    historyAppend(city);
                }
            }
        }

    });
}

function UVIndex(ln,lt){
    
    var uvIndexUrl="https://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey +"&lat="+lt+"&lon="+ln;
    $.ajax({
            url: uvIndexUrl,
            method:"GET"
            }).then(function(response){
                $(uvCurr).html(response.value);
            });
}

function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

$(window).on("load",loadHistory);

function historyAppend(c){
    var searchHistory= $("<li>"+c.toUpperCase()+"</li>");
    $(searchHistory).attr("class","search-list-item");
    $(searchHistory).attr("data-value",c.toUpperCase());
    $(".search-history").append(searchHistory);
}

function loadHistory(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            historyAppend(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}


function fiveDay(cityid){
    var dayover = false;
    var fiveDayUrl ="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+apiKey;
    $.ajax({
        url: fiveDayUrl,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#card-date"+i).html(date);
            $("#card-img"+i).html("<img src="+iconurl+">");
            $("#card-temp"+i).html(tempF+"&#8457");
            $("#card-hum"+i).html(humidity+"%");
        }
        
    });
}





