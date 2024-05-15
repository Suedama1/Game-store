
function loadCategories() {
    var categorySettings = {
        "url": "http://localhost:3000/allCategories",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(categorySettings).done(function (response) {
        $('#category').empty();

        $('#category').append($('<option>', {
            value: '',
            text: 'Select a Category',
            disabled: true,
            selected: true
        }));

        $.each(response, function (i, item) {
            $('#category').append($('<option>', {
                value: item.catname,
                text: item.catname
            }));
        });

        var selectedCategory = localStorage.getItem('selectedCategory');
        if (selectedCategory) {
            $('#category').val(selectedCategory);
        }
    });
}

function loadPlatforms() {
    var platformSettings = {
        "url": "http://localhost:3000/allPlatforms",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(platformSettings).done(function (response) {
        $('#platform').empty();

        $('#platform').append($('<option>', {
            value: '',
            text: 'Select a Platform',
            disabled: true,
            selected: true
        }));

        $.each(response, function (i, item) {
            $('#platform').append($('<option>', {
                value: item.platform_name,
                text: item.platform_name
            }));
        });

        var selectedPlatform = localStorage.getItem('selectedPlatform');
        if (selectedPlatform) {
            $('#platform').val(selectedPlatform);
        }
    });
}

$(document).ready(function () {
    loadCategories();
    loadPlatforms();


});