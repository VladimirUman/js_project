//Show and hide buttons
displayButton();

function displayButton () {
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    document.getElementById('logoutButton').style.display = "block";
    document.getElementById('profileButton').style.display = "block";
    document.getElementById('loginButton').style.display = "none";
    document.getElementById('signButton').style.display = "none";
  } else {
    document.getElementById('logoutButton').style.display = "none";
    document.getElementById('profileButton').style.display = "none";
    document.getElementById('loginButton').style.display = "block";
    document.getElementById('signButton').style.display = "block";
  }
}

//Log in
function login () {

  $("#loginModal").modal();

  document.getElementById('loginSubmit').onclick = function () {

    const user = {
      email: document.getElementById('email').value,
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.user.name);
        localStorage.setItem('userId', data.user._id);
        //console.log(data);
        displayButton();
      } else {
        document.getElementById('message').innerHTML = data.message;
      }
    })
    .catch(function() {
      console.log('Error');
    });
  };
  document.getElementById('email').value = "";
  document.getElementById('password').value = "";

};

document.getElementById('loginButton').onclick = login;

//Log out
document.getElementById('logoutButton').onclick = function () {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  displayButton();
};


//Sign up
document.getElementById('signButton').onclick = function () {

  $("#signModal").modal();

  document.getElementById('signSubmit').onclick = function () {

    const user = {
      name: document.getElementById('signName').value,
      email: document.getElementById('signEmail').value,
      password: document.getElementById('signPassword').value,
      twitter_account: document.getElementById('signAccount').value
    };

    var request = new Request('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    });
    fetch(request)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      if (data.message == 'OK') {
        $('#signModal').modal('hide')
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.user.name);
        localStorage.setItem('userId', data.user._id);
        displayButton();
      } else {
        document.getElementById('signMessage').innerHTML = data.message;
        console.log(data);
      }
    })
    .catch(function() {
      console.log('Error signup');
    });
  };

  document.getElementById('signName').value = "";
  document.getElementById('signEmail').value = "";
  document.getElementById('signPassword').value = "";
  document.getElementById('signAccount').value = "";

};

//Change profile
document.getElementById('profileButton').onclick = function () {

  userId = localStorage.getItem('userId');
  var request = new Request('/api/users/' + userId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
              authorization: localStorage.getItem('token')
    }
  });
  fetch(request)
  .then(function(response) {
    return response.json()
  })
  .then(function(data) {
    if (data.message == 'OK') {
      $("#profileModal").modal();
      document.getElementById('profileName').value = data.user.name;
      document.getElementById('profileEmail').value = data.user.email;
      document.getElementById('profilePassword').value = data.user.password;
      document.getElementById('profileAccount').value = data.user.twitter_account;
    } else {
      document.getElementById('signMessage').innerHTML = data.message;
      //console.log(data);
    }
  })
  .catch(function() {
    console.log('Error change profile');
  });

  document.getElementById('profileSubmit').onclick = function () {

    const user = {
      name: document.getElementById('profileName').value,
      email: document.getElementById('profileEmail').value,
      password: document.getElementById('profilePassword').value,
      twitter_account: document.getElementById('profileAccount').value
    };

    var request = new Request('/api/users/' + userId, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
               }
    });
    fetch(request)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      if (data.message == 'OK') {
        $('#profileModal').modal('hide')
      } else {
        document.getElementById('profileMessage').innerHTML = data.message;
        //console.log(data);
      }
    })
    .catch(function() {
      console.log('Error change profile');
    });
  };

  document.getElementById('profileDelete').onclick = function () {

    var request = new Request('/api/users/' + userId, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
               }
    });
    fetch(request)
    .then(function(response) {
      if (response.status == 200) {
        ('#profileModal').modal('hide')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        displayButton();
      }
      return response.json()
    })
    .catch(function() {
      console.log('Error delete profile');
    });
  };

};

var markers = [];
//Init map and adding checkins
var map;
const url = '/api/checkins';
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 49.2212619, lng: 28.4229144 },
    zoom: 14
  });

  //Add checkin
  google.maps.event.addListener(map, 'click', function(event) {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      $("#checkinModal").modal();

      document.getElementById('sub').onclick = function () {
        const checkin = {
          cord: event.latLng,
          place: document.getElementById('place').value,
          description: document.getElementById('description').value
        }

        var request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(checkin),
            headers: {
              'Content-Type': 'application/json',
              authorization: localStorage.getItem('token')
            }
        });
        fetch(request)
        .then(function(response) {
          return response.json()
        })
        .then(function(data) {
          if (data.message == 'OK') {
            $('#checkinModal').modal('hide');
            addMarker(data.checkin)
          } else {
            document.getElementById('checkinMessage').innerHTML = data.message;
            //console.log(data);
          }
        })
        .catch(function() {
            console.log('Error add checkin');
        });
      };
      document.getElementById('place').value = "";
      document.getElementById('description').value = "";
    } else {
      login();
    }
  });
  getCheckins();

}

//Get checkins
function getCheckins () {
  fetch(url)
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(checkins) {
    //console.log(checkins);
    checkins.map((checkin) => addMarker(checkin));
  })
  .catch(function() {
      console.log('Error get checkins');
  });
}
//Edit checkin
function editCheckin (checkinId) {
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    $("#editCheckinModal").modal();

    var request = new Request('/api/checkins/' + checkinId, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
      }
    });
    fetch(request)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      if (data.message == 'OK') {
        document.getElementById('editCheckinPlace').value = data.checkin.place;
        document.getElementById('editCheckinDescription').value = data.checkin.description;
      } else {
        document.getElementById('signMessage').innerHTML = data.message;
        //console.log(data);
      }
    })
    .catch(function() {
      console.log('Error get checkin');
    });

    document.getElementById('editCheckinSubmit').onclick = function () {

      const checkin = {
        place: document.getElementById('editCheckinPlace').value,
        description: document.getElementById('editCheckinDescription').value
      };

      var request = new Request('/api/checkins/' + checkinId, {
        method: 'PUT',
        body: JSON.stringify(checkin),
        headers: { 'Content-Type': 'application/json',
                  authorization: localStorage.getItem('token')
                 }
      });
      fetch(request)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        if (data.message == 'OK') {
          $('#editCheckinModal').modal('hide');
          deleteAllMarkers();
          getCheckins();
        } else {
          document.getElementById('editCheckinMessage').innerHTML = data.message;
          console.log(data);
        }
      })
      .catch(function() {
        console.log('Error change checkin');
      });
    };

    document.getElementById('editCheckinDelete').onclick = function () {

      var request = new Request('/api/checkins/' + checkinId, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
                  authorization: localStorage.getItem('token')
                 }
      });
      fetch(request)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        if (data.message == 'OK') {
          $('#editCheckinModal').modal('hide');
          deleteAllMarkers();
          getCheckins();
          //console.log(data);
        }
      })
      .catch(function() {
        console.log('Error delete checkin');
      });
    };
  } else {
    login();
  }
}

//Delete all markers
function deleteAllMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

//Add marker on map
function addMarker(checkin) {
  var marker = new google.maps.Marker({
    position: checkin.cord,
    map: map,
    clickable:true,
    title: checkin.place
  });

  var raitingString = '';
  for (var i = 1; i <= 5; i++) {
    if (checkin.raiting >= i) {
      raitingString += '<span class="glyphicon glyphicon-star"></span>';
    } else {
      raitingString += '<span class="glyphicon glyphicon-star-empty"></span>';
    }
  }

  var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h3 id="firstHeading" class="firstHeading">' + checkin.place + '</h3>' +
      '<div id="bodyContent">'+
      '<div class="total-raiting"><strong>' + checkin.raiting + '</strong>' + raitingString + '</div>' +
      '<div class="total-comments"><a onclick="showComments(\'' + checkin._id + '\');"> Comments: ' + checkin.votes + '</a></div>' +
      '<div class="window-text">' + checkin.description + '</div>' +
      '<div class="window-links"><a onclick="addComment(\'' + checkin._id + '\');">Add comment</a>' +
      '<a onclick="editCheckin(\'' + checkin._id + '\');">  Edit checkin</a></div>' +
      '</div>' +
      '</div>'

  var infowindow = new google.maps.InfoWindow({
     content: contentString,
     maxWidth: 500
  });

  marker.addListener('click', function() {
     infowindow.open(map, marker);
  });
  //markers.push(marker);
  //var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/images/m'});
}

//Comments
function showComments (checkinId) {
  var url = '/api/comments/' + checkinId;
  var request = new Request(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  fetch(request)
  .then(function(response) {
    //console.log(response);
    return response.json()
  })
  .then(function(comments) {
    //console.log(comments);
    var div = document.getElementById('comments');
    div.innerHTML = '';
    for (var i = 0; i < comments.length; i++) {
      var comment = document.createElement('div');
      comment.className = "comment";
      var commentName = document.createElement('div');
      commentName.className = "comment-name";
      var commentRaiting = document.createElement('div');
      for (var j = 1; j <= 5; j++) {
        var star = document.createElement('span');
        star.className = "glyphicon glyphicon-star-empty";
        if (comments[i].raiting >= j) {
          star.className = "glyphicon glyphicon-star";
        }
        commentRaiting.appendChild(star);
      }
      commentRaiting.className = "star-raiting";
      var commentText = document.createElement('div');
      commentText.className = "comment-text";
      commentName.innerHTML = comments[i].name;
      comment.appendChild(commentName);
      comment.appendChild(commentRaiting);
      commentText.innerHTML = comments[i].text;
      comment.appendChild(commentText);
      var line = document.createElement('hr');
      comment.appendChild(line);
      div.appendChild(comment);
    }
    document.getElementById('commentsPanel').style.display = "block";
  })
  .catch(function() {
    console.log('Error get comments');
  });

};

function closeComments () {
  document.getElementById('commentsPanel').style.display = "none";
}

//Add comment
function addComment (checkinId) {
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    $("#commentModal").modal();
    star1.className = "glyphicon glyphicon-star-empty";
    star2.className = "glyphicon glyphicon-star-empty";
    star3.className = "glyphicon glyphicon-star-empty";
    star4.className = "glyphicon glyphicon-star-empty";
    star5.className = "glyphicon glyphicon-star-empty";

    document.getElementById('commentSubmit').onclick = function () {
      const comment = {
        text: document.getElementById('addComment').value,
        raiting: setRaiting
      }
      //console.log(comment);
      var url = '/api/comments/' + checkinId;

      var request = new Request(url, {
          method: 'POST',
          body: JSON.stringify(comment),
          headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem('token')
          }
      });
      fetch(request)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        if (data.message == 'OK') {
          $('#commentModal').modal('hide');
          deleteAllMarkers();
          getCheckins();
          showComments(checkinId)
        }
      })
      .catch(function() {
          console.log('Error add comment');
      });
    };
    document.getElementById('addComment').value = "";
  } else {
    login();
  }
}

var star1 = document.getElementById('star1');
var star2 = document.getElementById('star2');
var star3 = document.getElementById('star3');
var star4 = document.getElementById('star4');
var star5 = document.getElementById('star5');
var setRaiting;

//star1.onmouseover = star1.onmouseout = star1.onclick = handler;
//star2.onmouseover = star2.onmouseout = star2.onclick = handler;
//star3.onmouseover = star3.onmouseout = star3.onclick = handler;
//star4.onmouseover = star4.onmouseout = star4.onclick = handler;
//star5.onmouseover = star5.onmouseout = star5.onclick = handler;

star1.onclick = handler;
star2.onclick = handler;
star3.onclick = handler;
star4.onclick = handler;
star5.onclick = handler;

function handler(event) {
  //console.log(event);
  var stars = [star1, star2, star3, star4, star5];
  /*
  if (event.type == 'mouseover') {
    var rait = event.target.dataset.rait;
    for (var i = 0; i < rait; i++) {
      stars[i].className = "glyphicon glyphicon-star"
    }
  }
  if (event.type == 'mouseout') {
    event.target.className = "glyphicon glyphicon-star-empty"
  }
  */
  if (event.type == 'click') {
    setRaiting = event.target.dataset.rait;
    for (var i = 0; i < setRaiting; i++) {
      stars[i].className = "glyphicon glyphicon-star"
    }
    for (var i = setRaiting; i < 5; i++) {
      stars[i].className = "glyphicon glyphicon-star-empty"
    }
    //console.log(setRaiting);
  }
}
