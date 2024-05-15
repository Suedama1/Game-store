


document.getElementById("submit-button").addEventListener("click", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const currentPassword = document.getElementById("current-password").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#\$%\^\&*\)\(+=._-]/;
    const eightCharRegex = /.{8,}/;

    let errorCount = 0;

    document.getElementById("username-error").innerText = username === "" ? "Please enter a username." : "";
    let passwordError = '';
    if (!uppercaseRegex.test(password)) passwordError += "Password does not contain an uppercase letter.\n";
    if (!lowercaseRegex.test(password)) passwordError += "Password does not contain a lowercase letter.\n";
    if (!numberRegex.test(password)) passwordError += "Password does not contain a number.\n";
    if (!specialCharRegex.test(password)) passwordError += "Password does not contain a special character.\n";
    if (!eightCharRegex.test(password)) passwordError += "Password is not at least 8 characters long.";

    document.getElementById("password-error").innerText = passwordError;

    document.getElementById("confirm-password-error").innerText = password !== confirmPassword ? "Passwords do not match." : "";

    document.getElementById("current-password-error").innerText = '';

    const errorElements = document.querySelectorAll(".form-error");
    errorElements.forEach((el) => {
        if (el.innerText !== "") errorCount++;
    });

    if (errorCount === 0) {

        $.ajax({
            url: `http://localhost:3000/checkPassword?password=${currentPassword}`,
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            success: function (response) {
                console.log(response.message);

                if (response.message === "Password matches.") {

                    var formData = new FormData();
                    var fileField = document.querySelector('input[type="file"]');
                    fileField.onchange = function () {
                        document.getElementById("image-error").innerText = ''; 
                    }
                    formData.append('image', fileField.files[0]);

                    $.ajax({
                        url: 'http://localhost:3000/uploadPFP',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("jwt"),
                        },
                        success: function (data) {
                            console.log('upload successful: ' + data);

                            document.getElementById("image-error").innerText = '';
                            fileField.value = '';

                            var userObj = {
                                username: username,
                                password: password
                            };

                            var settings = {
                                url: "http://localhost:3000/profile",
                                method: "PUT",
                                timeout: 0,
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                                },
                                data: JSON.stringify(userObj),
                            };

                            $.ajax(settings).done(function (response) {
                                // console.log(response);
                                localStorage.removeItem('jwt')
                                localStorage.removeItem('username')
                                window.location.href = "login.html";
                            }).fail(function (jqXHR, textStatus, errorThrown) {
                                console.log("PUT request Error: " + textStatus, errorThrown);
                            });

                        },
                        error: function (jqXHR, status, error) {
                            console.log('upload error: ', error);
                            document.getElementById("image-error").innerText = 'Error uploading file. Please make sure the image size is less than 1MB.';
                        }
                    });
                } else {
                    // console.log("Password does not match.");
                    document.getElementById("current-password-error").innerText = "Current password does not match.";
                }
            }
        });
    }
});
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
function updateProfileImage(token) {
    $.ajax({
        url: 'http://localhost:3000/profilePFP',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            if (response.profile_pic_url) {
                $('#profileImage').attr('src', response.profile_pic_url);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus, errorThrown);
        }
    });
}

var jwt = localStorage.getItem('jwt');
if (jwt) {
    fetchUserProfiel(jwt);
    updateProfileImage(jwt); // Call the function here

}