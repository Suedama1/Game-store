

$(document).ready(function () {
    var jwtToken = localStorage.getItem('jwt');

    $('#delplatform-form').on('submit', function (event) { 
        event.preventDefault();

        var platform_name = $('#platform').val();

        var settings = {
            "url": "http://localhost:3000/platform", 
            "method": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}` 
            },
            "data": JSON.stringify({
                "platform_name": platform_name 
            }),
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            // alert('Platform deleted successfully');
            // window.location.reload();
            document.getElementById("del-plat-success").innerText = 'Platform selected has been deleted';
            $('#platform').val('');
            // $('#platform option[value="' + platform_name + '"]').remove();

            loadPlatforms();
        }).fail(function (jqXHR, textStatus, error) {
            console.log("Error deleting platform:", error);
        });
    });
});