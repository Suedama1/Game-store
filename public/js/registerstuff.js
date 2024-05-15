

document.getElementById("register-button").addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const emailRegex = /\S+@\S+\.\S+/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#\$%\^\&*\)\(+=._-]/;

    let errorCount = 0;

    document.getElementById("email-error").innerText = emailRegex.test(email) ? "" : "Please enter a valid email address.";
    document.getElementById("username-error").innerText = username === "" ? "Please enter a username." : "";

    let passwordError = '';
    if (!uppercaseRegex.test(password)) passwordError += "Password does not contain an uppercase letter.\n";
    if (!lowercaseRegex.test(password)) passwordError += "Password does not contain a lowercase letter.\n";
    if (!numberRegex.test(password)) passwordError += "Password does not contain a number.\n";
    if (!specialCharRegex.test(password)) passwordError += "Password does not contain a special character.";

    document.getElementById("password-error").innerText = passwordError;

    document.getElementById("confirm-password-error").innerText = password !== confirmPassword ? "Passwords do not match." : "";

    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach((el) => {
        if (el.innerText !== '') errorCount++;
    });

    if (errorCount === 0) {
        var userObj = {
            email: email,
            username: username,
            password: password,
        };

        var settings = {
            "url": "http://localhost:3000/users",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(userObj),
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);

            $.ajax({
                url: 'http://localhost:3000/login', 
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function (loginResponse) {
                    // console.log(loginResponse);

                    if (loginResponse.token) {
                        localStorage.setItem('jwt', loginResponse.token);
                        window.location.href = 'index.html';
                    } else {
                        console.log('Error: Unable to login');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Error: ' + textStatus, errorThrown);
                }
            });

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error: ", textStatus, ", ", errorThrown);
            if (jqXHR.status === 422) {
                document.getElementById("email-error").innerText = "Email already exists.";
            }
        });
    }
});

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

var jwt = localStorage.getItem('jwt');
if (jwt) {
    fetchUserProfiel(jwt);
}