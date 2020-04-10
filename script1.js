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

  
  if(userlocal.length!=0){
  rendermap(latn,lonn);
  }else{
    initMap(latn, lonn);
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


//*************/
//Score card //
//********* */
$(document).ready(function(){
r = 0
    localscore();
    total();
    $('.startbtn').on('click',function(){
        reset();
        nexthole(0);
    })
    $('body').on('click','.nxtbtn',function(){
        navigator.geolocation.getCurrentPosition(success,error,options);
        var q = $(this).siblings('.holen').text();
        console.log(q);
        var t = $(this).siblings('.score').text();
        if(q==18){alert('Game Over');
            endhole(q,t);
            $(this).prop('disabled', true)
            $(this).removeClass('bg-blue-500');
            $(this).addClass('bg-blue-200');
            $(this).siblings('.plsbtn').prop('disabled',true);
            $(this).siblings('.plsbtn').addClass('bg-green-200').removeClass('bg-green-500');
            $(this).siblings('.msbtn').prop('disabled',true);
            $(this).siblings('.msbtn').addClass('bg-red-200').removeClass('bg-red-500');
          }else{
            console.log(t)
            nexthole(parseInt(q));
            endhole(q,t);
            $(this).prop('disabled', true)
            $(this).removeClass('bg-blue-500');
            $(this).addClass('bg-blue-200');
            $(this).siblings('.plsbtn').prop('disabled',true);
            $(this).siblings('.plsbtn').addClass('bg-green-200').removeClass('bg-green-500');
            $(this).siblings('.msbtn').prop('disabled',true);
            $(this).siblings('.msbtn').addClass('bg-red-200').removeClass('bg-red-500');
            //$(this).parent().addClass('hidden')
            storelocation(lat,lon)
            

        }
        

    
    })
    $('body').on('click','.plsbtn',function(){
        var r = parseInt($(this).prev().text())
        r++;
        $(this).prev().text(r);
        total();
    })
    $('body').on('click','.msbtn',function(){
        var s = parseInt($(this).next().text())
        s--;
        $(this).next().text(s);
        total();
    })

})


var scorecard = [
    {hole: "", total: ""}
];

var usersc = JSON.parse(localStorage.getItem("userscore")) || [];


function nexthole(i){
    var btnclass = 'container w-1/5 text-center text-white font-bold py-2 px-2 rounded';
    var entryrow = $('<div class="container flex flex-wrap mx-auto my-2"'+ "id="+i+">");
    var hole = $('<div class="text-center w-1/5 holen">').text(i+1);
    var minusbtn = $('<button class="bg-red-500 msbtn '+btnclass+'">-</button>');
    var score = $('<div class="w-1/5 text-center bg-grey-500 score" data='+(i)+'>').text(0);
    var plusbtn = $('<button class="bg-green-500 plsbtn '+btnclass+'">+</button>');
    //var total = $('<div class="container w-1/6 text-center bg-grey-500">').text('total');
    var nxtbtn = $('<button class="bg-blue-500 nxtbtn '+btnclass+' w-1/6 mx-auto">Next</button>');


    $('#start').append(entryrow);
    entryrow.append(hole);
    entryrow.append(minusbtn);
    entryrow.append(score);
    entryrow.append(plusbtn);
    entryrow.append(total);
    entryrow.append(nxtbtn);
}


function endhole(holenum,score){

    const holescore = {
        hlnum: holenum,
        hlscore: score
    }
    var pos = usersc.map(function(e) { return e.hlnum; }).indexOf(holenum);
    console.log(pos);
    if(pos==-1){usersc.push(holescore)};
    
    console.log(usersc);
    localStorage.setItem("userscore",JSON.stringify(usersc));
}

function localscore(){
    var btnclass = 'container w-1/5 text-center text-white font-bold py-2 px-4 rounded';
    for(l=0;l<usersc.length;l++){
        var entryrow = $('<div class="container flex flex-wrap mx-auto my-2"'+ "id="+l+">");
        var hole = $('<div class="text-center w-1/5 holen">').text(usersc[l].hlnum);
        var minusbtn = $('<button class="bg-red-200 msbtn '+btnclass+'" disabled>-</button>');
        var score = $('<div class="w-1/5 text-center bg-grey-500 score" data='+(l)+'>').text(usersc[l].hlscore);
        var plusbtn = $('<button class="bg-green-200 plsbtn '+btnclass+'" disabled>+</button>');
        //var total = $('<div class="container w-1/6 text-center bg-grey-500">').text('total');
        var nxtbtn = $('<button class="bg-blue-200 nxtbtn '+btnclass+' w-1/6 mx-auto" disabled>Next</button>');
        $('#start').append(entryrow);
        entryrow.append(hole);
        entryrow.append(minusbtn);
        entryrow.append(score);
        entryrow.append(plusbtn);
        entryrow.append(total);
        entryrow.append(nxtbtn);

    };

    $('#start .flex .nxtbtn').last().removeAttr('disabled');
    $('#start .flex .nxtbtn').last().removeClass('bg-blue-200');
    $('#start .flex .nxtbtn').last().addClass('bg-blue-500');

}

function total(){
    var sum = 0;
$('.score').each(function() {
  sum += +$(this).text()||0;
});
$('#htotal').text(sum)
}

function reset(){
    localStorage.removeItem("userscore");
    usersc=[];
    $('#htotal').text(0);
    $('#start').html("");
}


function initMap(lat, log) {
    var latlog = new google.maps.LatLng(lat, log);
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17, center: latlog,
  
    });
        new google.maps.Marker({position: latlog, map: map, 
        icon: 'https://maps.google.com/mapfiles/kml/shapes/golf.png'});

    // google.maps.event.addListener(map, 'click', function(event) {
    //   var latt = event.latLng.lat();
    //   var long = event.latLng.lng()
    //   console.log(latt, long);
    //   new google.maps.Marker({position: event.latLng, map: map, 
    //     icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'});
    //   storelocation(latt,long);
      
    // });

};


function storelocation(lat, lon){

var numhole = parseInt(usersc.length)-1;
var userholemap = usersc[numhole].hlnum;

  const coursedata = {
    holenum: userholemap,
    latitude: lat,
    longitude: lon
  }

  if(userlocal.length==0){
    userlocal.push(coursedata);
    
  }else{
    var pos = userlocal.map(function(e) { return e.holenum; }).indexOf(userholemap);
  console.log(pos);
  if(pos==-1){userlocal.push(coursedata)};

  }
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

    //   google.maps.event.addListener(map, 'click', function(event) {
    //   var latt = event.latLng.lat();
    //   var long = event.latLng.lng()
    //   console.log(latt, long);
    //   new google.maps.Marker({position: event.latLng, map: map, 
    //     icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'});
    //   storelocation(latt,long);
      
    // })



}

$('#reset').on('click',function(){
  localStorage.removeItem('course_data');
  userlocal=[];
  initMap(lat,lon);
  
  
})


