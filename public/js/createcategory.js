$(document).ready(function () {
    var jwtToken = localStorage.getItem('jwt');
    $('#category-form').on('submit', function (event) {
        event.preventDefault();

        var catname = $('#category-name').val();
        var description = $('#category-description').val();

        var settings = {
            "url": "http://localhost:3000/category",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            "data": JSON.stringify({
                "catname": catname,
                "description": description
            }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            document.getElementById('add-cat-message').innerText = response.message;
            document.getElementById('add-cat-message').style.color = 'green'; 

            $('#category-name').val('');
            $('#category-description').val('');

            loadCategories();

        }).fail(function (jqXHR, textStatus, error) {
            if (jqXHR.status === 409) {
                document.getElementById('add-cat-message').innerText = 'Category already exists';
                document.getElementById('add-cat-message').style.color = 'red';
            } else {
                console.log("Error creating category:", error);
            }
        });
    });
});