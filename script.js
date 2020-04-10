//PangSzee's - Geolocation

var lat, lon;
var apikey ='08d6ce794cdf279b6219aa4a39a325d7';
var options = {
    enableHighAccuracy:true,
    timeout: 5000,
    maximumAge:0
};
var userlocal = JSON.parse(localStorage.getItem("course_data")) || [];
navigator.geolocation.getCurrentPosition(success,error,options);

  
function success(pos){
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
  console.log("Latitude = " + lat + " " + "Longitude = " + lon);
  $('#lat').text(lat);
  $('#lon').text(lon);
  latn = parseFloat(lat);
  lonn = parseFloat(lon);
  console.log(latn, lonn)
  info(latn,lonn);
  forcast(latn, lonn);
  initMap(latn, lonn);
  if(userlocal.length!=0){
  rendermap(latn,lonn);
  }
  

  }
  
function error(error){
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
    }
  }


function info(lat, lon){

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&appid='+apikey;
    $.ajax({
          url: queryURL,
          method: "GET",
          success: function(response){
            var result = response;
            $('#temp').text(result.main.temp)
            $('#wspd').text(result.wind.speed)
            $('#forcast').text(result.weather[0].main)   
          },
          error: function(){
            var msg = "City Not found";
            console.log(msg);
          }

})
}

function forcast(lat, lon){
  var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=metric&appid='+apikey;
  
  $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
          var foreinfo = response;
          console.log(foreinfo)
          displayforecast(foreinfo)
})
}


function displayforecast(obj){
  $('#forecast').html("");
  for(i=0;i<3;i++){

    var frarr = i;
    var fdate = obj.list[frarr].dt;
    var dateString = moment.unix(fdate).format('ddd, hh:mm');
    var ftemp = Math.round(obj.list[frarr].main.temp);
    var ficon = obj.list[frarr].weather[0].icon;
    var ficonurl = 'https://openweathermap.org/img/wn/'+ficon+'.png';
    var fhumid = obj.list[frarr].main.humidity;
    var fblock = $('<div class="inline-block m-2">');
    var finfo = $('<div class="p-2">').text(dateString);
    var fdicon = $('<img src='+ficonurl+' alt="weather icon">');
    var fdtemp = $('<div class="">').text("Temp: "+ftemp+" °C");
    var fdhum = $('<div class="">').text("Humidity: "+fhumid+" %");
    $('#forecast').append(fblock);
    fblock.append(finfo);
    finfo.append(fdtemp);
    fdtemp.append(fdhum);
    fdhum.append(fdicon);

  }
  
}


var displaycompass = function(){
  
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (iOS === true){

    var createButton = document.createElement("div");  
    createButton.innerHTML = "Compass";    
    createButton.setAttribute("class","opacity-0 text-white font-bold py-2 px-4 rounded-full")   
    createButton.setAttribute("id","but")
    //createButton.setAttribute("type","button")       
    document.getElementsByClassName("compassdisplay")[0].appendChild(createButton); 

    /* https://stackoverflow.com/questions/16048514/can-i-use-javascript-to-get-the-compass-heading-for-ios-and-android
stackoverflow was used to find the ollowing code to gain access to movement and orientation on ios devices*/
    var button = document.getElementById("but");
    button.addEventListener("click", function () {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response == 'granted') {
        var rmbut = document.getElementById('but')
          rmbut.parentNode.removeChild(button)
         window.addEventListener('devicemotion', (e) => {
          
        })
     }
    }).catch(console.error)
    });
  }


          

          var rmtext = document.getElementById('pleasenote')
          rmtext.innerHTML="";
          


  
     if (window.DeviceOrientationEvent) {
     window.addEventListener('deviceorientation', function(eventData) {
      if(event.webkitCompassHeading) {
        compassdir = event.webkitCompassHeading;  
      }
      else compassdir = event.alpha;

      var update = document.getElementById("degree")
  update.innerHTML = '';
  var direc = 360 - compassdir 
  var arrowimg = document.getElementById('arrow');
  arrowimg.setAttribute('style','transform:rotate('+ direc +'deg)');
 

  
  
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&appid='+apikey;
    $.ajax({
          url: queryURL,
          method: "GET",
          success: function(response){
            var result = response;
            
            var windspeed = (result.wind.speed)
            var windDirection = (result.wind.deg)

            var rmtext = document.getElementById('windavailable')
          rmtext.innerHTML= windspeed+"m/s";
               var directionarrow = document.getElementById("windarrow");
  
              var winddegrees = windDirection-compassdir-90;
  directionarrow.setAttribute('style','transform:rotate('+ winddegrees +'deg)');

          },
          

})

 


    });
    

    
  }




}
displaycompass()


function initMap(lat, log) {
    var latlog = new google.maps.LatLng(lat, log);
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17, center: latlog,
  
    });
        new google.maps.Marker({position: latlog, map: map, 
        icon: 'https://maps.google.com/mapfiles/kml/shapes/golf.png'});

    google.maps.event.addListener(map, 'click', function(event) {
      var latt = event.latLng.lat();
      var long = event.latLng.lng()
      console.log(latt, long);
      new google.maps.Marker({position: event.latLng, map: map, 
        icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'});
      storelocation(latt,long);
      
    });

};


function storelocation(lat, lon){
  const coursedata = {
    holenum: 1,
    latitude: lat,
    longitude: lon
  }
  userlocal.push(coursedata);
  localStorage.setItem("course_data", JSON.stringify(userlocal));
}


function rendermap(lat,log){
  var latlog = new google.maps.LatLng(lat, log);
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17, center: latlog,

  });
      new google.maps.Marker({position: latlog, map: map, 
      icon: 'https://maps.google.com/mapfiles/kml/shapes/golf.png'});

  var usermap = JSON.parse(localStorage.getItem("course_data"));

  
  for(i=0;i<usermap.length;i++){
    var maplatt = usermap[i].latitude;
    var maplon =  usermap[i].longitude;
    var userlatlon = new google.maps.LatLng(maplatt,maplon);
    new google.maps.Marker({position: userlatlon, map: map, 
      icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'});
    
  }

      google.maps.event.addListener(map, 'click', function(event) {
      var latt = event.latLng.lat();
      var long = event.latLng.lng()
      console.log(latt, long);
      new google.maps.Marker({position: event.latLng, map: map, 
        icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'});
      storelocation(latt,long);
      
    })

}

$('#reset').on('click',function(){
  localStorage.removeItem('course_data');
  userlocal=[];
  initMap(lat,lon);
  
  
})


function renderCourseMap(userpos) {

  var user_loc = {lat: -34.961265, lng: 138.527800};
    // course_data array holds information on golf course, NOT ACTUAL CO-ORDINATE OF THE GOLF COURSE.
    var course_data = {
      hole_1: { 
        cordinates : {lat: -34.961287, lng: 138.527916},
        scoreboard : { par:4, black_tee:301,white_tee:301 }
      },
      hole_2: {
        cordinates : {lat: -34.964530, lng: 138.527971},
        scoreboard : { par:2, black_tee:418,white_tee:410 }
      },
      hole_3: { 
        cordinates : {lat: -34.964244, lng: 138.524223},
        scoreboard : { par:3, black_tee:202, white_tee:178 }
      },
      hole_4: {
        cordinates : {lat: -34.960518, lng: 138.532194},
        scoreboard : { par:4, black_tee:315, white_tee:296 }
      },
      hole_5: {
        cordinates : {lat: -34.964791, lng: 138.521978},
        scoreboard : { par:5, black_tee:490, white_tee:490 }
      },
      hole_6: {
        cordinates : {lat: -34.961085, lng: 138.524329},
        scoreboard : { par:4, black_tee:430, white_tee:400 }
      },
      hole_7: {
        cordinates : {lat: -34.963582, lng: 138.526938},
        scoreboard : { par:4, black_tee:394, white_tee:394 }
      },
      hole_8: {
        cordinates : {lat: -34.961744, lng: 138.525301},
        scoreboard : { par:4, black_tee:407, white_tee:384 }
      },
      hole_9: {
        cordinates : {lat: -34.958662, lng: 138.527802},
        scoreboard : { par:4, black_tee:376, white_tee:376 }
      },
      hole_10: {
        cordinates : {lat: -34.961706, lng: 138.526528},
        scoreboard : { par:4, black_tee:382, white_tee:366 }
      },
      hole_11: {
        cordinates : {lat: -34.959448, lng: 138.528874},
        scoreboard : { par:3, black_tee:168, white_tee:168 }
      },
      hole_12: {
        cordinates : {lat: -34.961470, lng: 138.527165},
        scoreboard : { par:5, black_tee:396, white_tee:349 }
      },
      hole_13: {
        cordinates : {lat: -34.958724, lng: 138.531413},
        scoreboard : { par:3, black_tee:164,white_tee:164 }
      },
      hole_14: {
        cordinates : {lat: -34.961458, lng: 138.529532},
        scoreboard : { par:3, black_tee:201,white_tee:211 }
      },
      hole_15: {
        cordinates : {lat: -34.961545, lng: 138.532869},
        scoreboard : { par:4, black_tee:321,white_tee:310 }
      },
      hole_16: {
        cordinates : {lat: -34.958326, lng: 138.533929},
        scoreboard : { par:3, black_tee:144,white_tee:144 }
      },
      hole_17: {
        cordinates : {lat: -34.959692, lng: 138.533539},
        scoreboard : { par:4, black_tee:386,white_tee:368 }
      },
      hole_18: {
        cordinates : {lat: -34.961558, lng: 138.533067},
        scoreboard : { par:5, black_tee:496,white_tee:496 }
      }
    }

    var markers = []; 
    var infowindow = [];

    var map = new google.maps.Map(document.getElementById('map'), {zoom: 16.5, center: user_loc}); 

    for (let i = 1; i < 18; i++) {
    // draw holes / bind click events to flags to infowindo/   
        infowindow[i] = new google.maps.InfoWindow({
              content: `<strong style="color:green">Hole - ${i}</strong>
              <br>Par: ${ eval('course_data.hole_'+i+'.scoreboard.par')}
              <br>Black Tee: ${ eval('course_data.hole_'+i+'.scoreboard.black_tee')}
              <br>White Tee: ${ eval('course_data.hole_'+i+'.scoreboard.white_tee')}
              <br>Coordinates: ${ eval('course_data.hole_'+i+'.cordinates.lat')} , ${ eval('course_data.hole_'+i+'.cordinates.lng')}
              `,
        });

        markers[i] = new google.maps.Marker({position: eval('course_data.hole_'+i+'.cordinates'), 
        map: map, icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'});

        markers[i].addListener('click', function() {
          infowindow[i].open(map, markers[i]);
        });


        
        new google.maps.Marker({position: user_loc, map: map, 
        icon: 'https://maps.google.com/mapfiles/kml/shapes/golf.png'});

    } // for (let i = 1; i < 3; i++)

} // renderCourseMap()

//google.maps.event.addDomListener(window, 'load', renderCourseMap)