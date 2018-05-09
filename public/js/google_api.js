var map;
//var markers = [];
const url = 'http://localhost:3000/checkins';
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 49.2212619, lng: 28.4229144 },
    zoom: 14
  });

  google.maps.event.addListener(map, 'click', function(event) {
    var title = prompt('Введите название:', '');
    if (title) {
      let checkin = {
        cord: event.latLng,
        place: title
      }
      addMarker(checkin);
      var request = new Request(url, {
          method: 'POST',
          body: JSON.stringify(checkin),
          headers: {
            'Content-Type': 'application/json'
          }
      });
      fetch(request)
      .catch(function() {
          console.log('Error');
      });
    }
  });

}

fetch(url)
.then((resp) => resp.json()) // Transform the data into json
.then(function(checkins) {
  //console.log(checkins);
  checkins.map((checkin) => addMarker(checkin));
})
.catch(function() {
    console.log('Error');
});

function addMarker(checkin) {
  var marker = new google.maps.Marker({
    position: checkin.cord,
    map: map,
    clickable:true,
    title: checkin.place
  });
/*
  var infowindow = new google.maps.InfoWindow({
     content: marker.title,
     maxWidth: 400
  });

  marker.addListener('click', function() {
     infowindow.open(map, marker);
  });
*/
}
