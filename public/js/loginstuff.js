
$(document).ready(function () {
    function updateNavBar(username) {
        $('.removeLogin').hide();
        var userNavItem = $(`<li class="nav-item dropdown">
                       <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                         Hello, ${username}
                       </a>
                       <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                         <li><a class="dropdown-item" href="updateuser.html">Edit Profile</a></li>
                         <li><a class="dropdown-item logout-btn" href="#">Logout</a></li>
                       </ul>
                     </li>`);

        $(".navbar-nav").append(userNavItem);

        $('.logout-btn').click(function () {
            localStorage.removeItem('jwt');
            localStorage.removeItem('username');
            localStorage.removeItem('userid');

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
                localStorage.setItem('username', username);
                $('#successful-login').text('Login successful');
                updateNavBar(username);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + textStatus, errorThrown);
                localStorage.removeItem('jwt');
                localStorage.removeItem('username');
            }
        });
    }

    $('#login-form').on('submit', function (event) {
        event.preventDefault();

        var email = $('#email').val();
        var password = $('#password').val();

        $.ajax({
            url: 'http://localhost:3000/login',
            method: 'POST',
            data: {
                email: email,
                password: password
            },
            success: function (response) {
                // console.log(response);
                if (response.token) {
                    localStorage.setItem('jwt', response.token);
                    fetchUserProfiel(response.token);
                    window.location.href = 'index.html';
                    $('#password-error').text('');

                } else {
                    $('#password-error').text('Invalid credentials');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + textStatus, errorThrown);
                $('#password-error').text('An error occurred during your request: ' + textStatus);
            }
        });
    });

    var jwt = localStorage.getItem('jwt');
    if (jwt) {
        fetchUserProfiel(jwt);
    }
});