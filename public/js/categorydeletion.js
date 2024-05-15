$(document).ready(function () {
    var jwtToken = localStorage.getItem('jwt');

    $('#delcategory-form').on('submit', function (event) {
        event.preventDefault();

        var catname = $('#category').val();

        var settings = {
            "url": "http://localhost:3000/category",
            "method": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}` 
            },
            "data": JSON.stringify({
                "catname": catname
            }),
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            // alert('Category deleted successfully');
            // window.location.reload();
            document.getElementById("del-cat-success").innerText = 'Category selected has been deleted';

            $('#category').val('');
            // $('#category option[value="' + catname + '"]').remove();
            loadCategories();
        }).fail(function (jqXHR, textStatus, error) {
            console.log("Error deleting category:", error);
        });
    });
});