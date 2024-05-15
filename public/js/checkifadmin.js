var jwtToken = localStorage.getItem('jwt');
if (!jwtToken) {
    window.location.href = "login.html";
} else {
    $.ajax({
        url: 'http://localhost:3000/profile',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        success: function (response) {
            var userType = response.credentials.type;
            // console.log(userType);
            if (userType !== 'Admin') {
                // console.log('goodbye idiot');
                window.location.href = "index.html";
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("login la idiot");
            window.location.href = "login.html";
        }
    });
}
