
$(document).ready(function () {
    var jwtToken = localStorage.getItem('jwt');

    $('#platform-form').on('submit', function (event) {
        event.preventDefault();

        var platformName = $('#platform-name').val();
        var platformDescription = $('#platform-description').val();

        var settings = {
            "url": "http://localhost:3000/platform",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            "data": JSON.stringify({
                "platform_name": platformName,
                "description": platformDescription
            }),
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            document.getElementById('add-plat-message').innerText = response.message;
            document.getElementById('add-plat-message').style.color = 'green';
            $('#platform-name').val('');
            $('#platform-description').val('');

            loadPlatforms();
        }).fail(function (jqXHR, textStatus, error) {
            if (jqXHR.status === 409) {
                document.getElementById('add-plat-message').innerText = 'Platform already exists';
                document.getElementById('add-plat-message').style.color = 'red';
            } else {
                console.log("Error creating platform:", error);
            }
        });
    });
});