var token = localStorage.getItem('token');

function login () {

  $("#loginModal").modal();

  document.getElementById('loginSubmit').onclick = function () {

    const user = {
      name: document.getElementById('name').value,
      password: document.getElementById('password').value
    };

    var request = new Request('/api/auth', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    });
    fetch(request)
    .then(function(response) {
      if (response.status == 200) {
        $('#loginModal').modal('hide')
      }
      return response.json()
    })
    .then(function(data) {
      if (data.message == 'OK') {
        localStorage.setItem('token', JSON.stringify(data.token))
        localStorage.setItem('user', JSON.stringify(data.name))
      }
      document.getElementById('message').innerHTML = data.message;
      console.log(data.message);
    })
    .catch(function() {
      console.log('Error');
    });
  };
  document.getElementById('name').value = "";
  document.getElementById('password').value = "";

};


document.getElementById('loginButton').onclick = login;

var map;
const url = '/api/checkins';
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 49.2212619, lng: 28.4229144 },
    zoom: 14
  });

  google.maps.event.addListener(map, 'click', function(event) {
    if (token) {
      $("#checkinModal").modal();

      document.getElementById('sub').onclick = function () {
        const checkin = {
          cord: event.latLng,
          place: document.getElementById('place').value,
          description: document.getElementById('description').value
        }

        addMarker(checkin);

        var request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(checkin),
            headers: {
              'Content-Type': 'application/json',
              authorization: JSON.parse(token)
            }
        });
        fetch(request)
        .catch(function() {
            console.log('Error');
        });
      };
      document.getElementById('place').value = "";
      document.getElementById('description').value = "";
    } else {
      login();
    }
  });

}

fetch(url)
.then((resp) => resp.json()) // Transform the data into json
.then(function(checkins) {
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

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h3 id="firstHeading" class="firstHeading">' + checkin.place + '</h3>'+
      '<div id="bodyContent">'+
      '<p>' + checkin.description + '</p>'+
      '</div>'+
      '</div>';


  var infowindow = new google.maps.InfoWindow({
     content: contentString,
     maxWidth: 500
  });

  marker.addListener('click', function() {
     infowindow.open(map, marker);
  });

}
