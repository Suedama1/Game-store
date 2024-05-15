
function updateNavBar(username, userType) {
    $('.removeLogin').hide();
    var userNavItem = $(`<li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Hello, ${username}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" href="updateuser.html">Edit Profile</a></li>
                </ul>
              </li>`);

    if (userType === "Admin") {
        userNavItem.find('.dropdown-menu').append('<li><a class="dropdown-item" href="adminpage.html">Admin Page</a></li>');
    }

    userNavItem.find('.dropdown-menu').append('<li><a class="dropdown-item logout-btn" href="#">Logout</a></li>');

    $(".navbar-nav").append(userNavItem);

    $('.logout-btn').click(function () {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        localStorage.removeItem('userid');

        window.location.href = 'index.html'

        $('.removeLogin').show();
        userNavItem.remove();
        $('#successful-login').text('');
    });
}

function fetchUserProfiel(token) {
    $.ajax({
        url: 'http://localhost:3000/profile',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            // console.log(response);
            var username = response.credentials.username;
            var userType = response.credentials.type;
            // console.log(userType);
            localStorage.setItem('username', username);
            $('#successful-login').text('Login successful');
            updateNavBar(username, userType); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus, errorThrown);
            localStorage.removeItem('jwt');
            localStorage.removeItem('username');
        }
    });
}

var jwt = localStorage.getItem('jwt');
if (jwt) {
    fetchUserProfiel(jwt);
}
