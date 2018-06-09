//Show and hide buttons
displayButton();

function displayButton () {
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    document.getElementById('logoutButton').style.display = "block";
    document.getElementById('loginButton').style.display = "none";
    document.getElementById('signButton').style.display = "none";
  } else {
    document.getElementById('logoutButton').style.display = "none";
    document.getElementById('loginButton').style.display = "block";
    document.getElementById('signButton').style.display = "block";
  }
}

//Log in
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
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.name));
        displayButton();
      } else {
        document.getElementById('message').innerHTML = data.message;
      }
    })
    .catch(function() {
      console.log('Error');
    });
  };
  document.getElementById('name').value = "";
  document.getElementById('password').value = "";

};

document.getElementById('loginButton').onclick = login;

//Log out
document.getElementById('logoutButton').onclick = function () {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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

        addMarker(checkin);

        var request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(checkin),
            headers: {
              'Content-Type': 'application/json',
              authorization: JSON.parse(localStorage.getItem('token'))
            }
        });
        fetch(request)
        .then(function(response) {
          if (response.status == 200) {
            $('#checkinModal').modal('hide')
          }
        })
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
//Get chekins
fetch(url)
.then((resp) => resp.json()) // Transform the data into json
.then(function(checkins) {
  checkins.map((checkin) => addMarker(checkin));
})
.catch(function() {
    console.log('Error get checkins');
});

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
      '<p><a onclick="addComment(\'' + checkin._id + '\');">Add comment</a></p>' +
      '</div>' +
      '</div>'

  var infowindow = new google.maps.InfoWindow({
     content: contentString,
     maxWidth: 500
  });

  marker.addListener('click', function() {
     infowindow.open(map, marker);
  });

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
      var star1 = document.createElement('span');
      star1.className = "glyphicon glyphicon-star-empty";
      if (comments[i].raiting >= 1) {
        star1.className = "glyphicon glyphicon-star";
      }
      commentRaiting.appendChild(star1);
      var star2 = document.createElement('span');
      star2.className = "glyphicon glyphicon-star-empty";
      if (comments[i].raiting >= 2) {
        star2.className = "glyphicon glyphicon-star";
      }
      commentRaiting.appendChild(star2);
      var star3 = document.createElement('span');
      star3.className = "glyphicon glyphicon-star-empty";
      if (comments[i].raiting >= 3) {
        star3.className = "glyphicon glyphicon-star";
      }
      commentRaiting.appendChild(star3);
      var star4 = document.createElement('span');
      star4.className = "glyphicon glyphicon-star-empty";
      if (comments[i].raiting >= 4) {
        star4.className = "glyphicon glyphicon-star";
      }
      commentRaiting.appendChild(star4);
      var star5 = document.createElement('span');
      star5.className = "glyphicon glyphicon-star-empty";
      if (comments[i].raiting >= 5) {
        star5.className = "glyphicon glyphicon-star";
      }
      commentRaiting.appendChild(star5);
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
      console.log(comment);
      var url = '/api/comments/' + checkinId;

      var request = new Request(url, {
          method: 'POST',
          body: JSON.stringify(comment),
          headers: {
            'Content-Type': 'application/json',
            authorization: JSON.parse(localStorage.getItem('token'))
          }
      });
      fetch(request)
      .then(function(response) {
        //console.log(response);
        if (response.status == 200) {
          $('#commentModal').modal('hide')
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
