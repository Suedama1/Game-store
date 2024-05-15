

function updatePlatformPrices() {
    var selectedPlatforms = $('#platform-checkboxes input:checked').map(function () {
        return {
            id: $(this).val(),
            name: $(this).data('name')
        };
    }).get();

    $('#platform-prices').empty();

    // loop through the selected platforms and create the price input fields
    $.each(selectedPlatforms, function (i, platform) {
        $('#platform-prices').append(
            '<div class="mb-1">' +
            '<label for="price-' + platform.id + '">' + platform.name + ' Price</label>' +
            '<input type="number" class="form-control" id="price-' + platform.id + '" name="price-' + platform.id + '">' +
            '<p id="price-error-' + platform.id + '" class="form-error" style="color: red;"></p>' +
            '</div>'
        );
    });
}

function loadPlatformsForGames() {
    var platformSettings = {
        "url": "http://localhost:3000/allPlatforms",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(platformSettings).done(function (response) {
        $('#platform-checkboxes').empty();
        // console.log(response);

        // Loop through the response and create list items with checkboxes
        $.each(response, function (i, item) {
            $('#platform-checkboxes').append(
                '<li class="list-group-item d-flex gap-2">' +
                '<input class="form-check-input flex-shrink-0" type="checkbox" id="platform-' + item.platform_name + '" name="platform" value="' + item.platformid + '" data-name="' + item.platform_name + '">' +
                '<label for="platform-' + item.platform_name + '">' + item.platform_name + '</label>' +
                '</li>'
            );
        });
    });
}

function loadCategoriesForGames() {
    var categorySettings = {
        "url": "http://localhost:3000/allCategories",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(categorySettings).done(function (response) {
        $('#category-checkboxes').empty();
        // console.log(response);

        // Loop through the response and create list items with checkboxes
        $.each(response, function (i, item) {
            $('#category-checkboxes').append(
                '<li class="list-group-item d-flex gap-2">' +
                '<input class="form-check-input flex-shrink-0" type="checkbox" id="category-' + item.catname + '" name="category" value="' + item.catid + '">' +
                '<label for="category-' + item.catname + '">' + item.catname + '</label>' +
                '</li>'
            );
        });
    });
}

$(document).ready(function () {
    $('#platform-checkboxes').on('change', 'input[type="checkbox"]', function () {
        updatePlatformPrices();
    });

    loadCategoriesForGames();
    loadPlatformsForGames();
    $('#game-form').submit(function (event) {
        event.preventDefault();

        var formData = new FormData();
        var title = document.getElementById("add-game-title").value;
        var description = document.getElementById("game-description").value;
        var yearPublished = $('#game-year').val();
        var fileField = document.querySelector('input[type="file"]');

        var hasError = false;

        if (title === '') {
            document.getElementById("add-game-title-error").innerText = 'Please enter a title';
            hasError = true;
        } else {
            document.getElementById("add-game-title-error").innerText = '';
        }

        if (description === '') {
            document.getElementById("game-description-error").innerText = 'Please enter a description';
            hasError = true;
        } else {
            document.getElementById("game-description-error").innerText = '';
        }

        if (yearPublished < 1959 || yearPublished > 2024) {
            document.getElementById("game-year-error").innerText = 'Year published must be between 1959 and 2024.';
            hasError = true;
        } else {
            document.getElementById("game-year-error").innerText = '';
        }
        var platformChecked = $('#platform-checkboxes input[type="checkbox"]:checked');

        var platforms = [];

        if (platformChecked.length === 0) {
            document.getElementById("platform-error").innerText = 'Please choose at least one platform.';
            hasError = true;
        } else {
            document.getElementById("platform-error").innerText = '';
            platformChecked.each(function () {
                platforms.push($(this).val());
            });
        }
        // type number but it allows input "e"? wtf? code?
        var platformPrices = [];
        $('#platform-prices input[type="number"]').each(function () {
            var platform = $(this).attr('id').split('-')[1];
            if ($(this).val() < 0 || $(this).val() === "") {
                document.getElementById("price-error-" + platform).innerText = 'Price cannot be negative or empty.';
                hasError = true;
            } else {
                document.getElementById("price-error-" + platform).innerText = '';
                platformPrices.push($(this).val()); 
            }
        });

        var categoryChecked = $('#category-checkboxes input[type="checkbox"]:checked');

        var categories = [];
        if (categoryChecked.length === 0) {
            document.getElementById("category-error").innerText = 'Please choose at least one category.';
            hasError = true;
        } else {
            document.getElementById("category-error").innerText = '';
            categoryChecked.each(function () {
                categories.push($(this).val());
            });
        }

        if (!fileField.files.length) {
            document.getElementById("image-error").innerText = 'Please choose an image.';
            hasError = true;
        } else {
            var fileSize = fileField.files[0].size / 1024 / 1024;
            if (fileSize > 1) {
                document.getElementById("image-error").innerText = 'File size exceeds 1MB. Please choose a smaller file.';
                hasError = true;
            } else {
                document.getElementById("image-error").innerText = '';
                formData.append('image', fileField.files[0]);
            }
        }

        if (hasError) return false;
        // thank u sng yong meng

        formData.append('title', title);
        formData.append('description', description);
        formData.append('yearPublished', yearPublished);
        platforms.forEach(function (platform) {
            formData.append('platforms[]', platform);
        });
        platformPrices.forEach(function (price) {
            formData.append('prices[]', price);
        });

        categories.forEach(function (category) {
            formData.append('categories[]', category);
        });

        var gameData = {
            title: title,
            description: description,
            year: yearPublished,
        };
        // console.log(gameData);

        $.ajax({
            url: 'http://localhost:3000/addGame',
            type: 'POST',
            data: JSON.stringify(gameData),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            success: function (data) {
                // console.log('success');
                // console.log(gameData.title);
                $.ajax({
                    url: 'http://localhost:3000/getGameId/' + gameData.title,
                    type: 'GET',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    },
                    success: function (data) {
                        // console.log(data.gameid);
                        let gameId = data.gameid;

                        formData.append('gameid', gameId);

                        $.ajax({
                            url: 'http://localhost:3000/uploadGameImage',
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                            },
                            success: function (data) {
                                // console.log(data);
                                document.getElementById("image-error").innerText = '';
                                fileField.value = '';

                                var platformData = {
                                    platforms: $('#platform-checkboxes input[type="checkbox"]:checked').map(function () { return this.value; }).get(),
                                    prices: $('#platform-prices input[type="number"]').map(function () { return this.value; }).get()
                                }

                                // console.log(platformData);
                                for (let i = 0; i < platformData.platforms.length; i++) {
                                    let gamePlatformData = {
                                        gameid: gameId,
                                        price: platformData.prices[i],
                                        platformid: platformData.platforms[i],
                                    };
                                    // console.log(gamePlatformData);

                                    $.ajax({
                                        url: 'http://localhost:3000/addGamePlatform',
                                        type: 'POST',
                                        data: JSON.stringify(gamePlatformData),
                                        contentType: "application/json",
                                        headers: {
                                            "Authorization": "Bearer " + localStorage.getItem("jwt"),
                                        },
                                        success: function (data) {
                                            console.log('Game platform added successfully.');
                                        },
                                        error: function (error) {
                                            console.log('Error adding game platform: ', error);
                                        }
                                    });
                                }

                                var categoryData = {
                                    categories: $('#category-checkboxes input[type="checkbox"]:checked').map(function () { return this.value; }).get(),
                                }

                                // console.log(categoryData);

                                for (let i = 0; i < categoryData.categories.length; i++) {
                                    let gameCategoryData = {
                                        gameid: gameId,
                                        gamecategoryid: categoryData.categories[i],
                                    };
                                    // console.log(gameCategoryData);

                                    $.ajax({
                                        url: 'http://localhost:3000/addGameCategory',
                                        type: 'POST',
                                        data: JSON.stringify(gameCategoryData),
                                        contentType: "application/json",
                                        headers: {
                                            "Authorization": "Bearer " + localStorage.getItem("jwt"),
                                        },
                                        success: function (data) {
                                            console.log('Game category added successfully.');
                                            document.getElementById("image-error").innerText = '';

                                            document.getElementById("add-game-title").value = '';
                                            document.getElementById("game-description").value = '';
                                            $('#game-year').val('');
                                            document.querySelector('input[type="file"]').value = '';
                                            $('#platform-checkboxes input[type="checkbox"]').prop('checked', false);
                                            $('#platform-prices input[type="number"]').val('');
                                            $('#category-checkboxes input[type="checkbox"]').prop('checked', false);

                                            document.getElementById("add-game-message").innerText = 'Game added!';
                                        },
                                        error: function (error) {
                                            console.log('Error adding game category: ', error);
                                        }
                                    });
                                }
                            },
                            error: function (jqXHR, status, error) {
                                // console.log(error);
                            }
                        });
                    },
                    error: function (error) {
                        console.log('Error getting game id: ', error);
                    }
                });
            }
        })

    });

    var fileField = document.querySelector('input[type="file"]');
    fileField.onchange = function () {
        document.getElementById("image-error").innerText = '';
    };
});