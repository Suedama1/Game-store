
var settings = {
    "url": "http://localhost:3000/topGames",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    // console.log(response);

    var carouselInner = $('#topGamesCarousel .carousel-inner');
    for (var i = 0; i < response.length; i++) {
        var itemHtml = `<div class="carousel-item clickable-carousel-item ${i === 0 ? 'active' : ''}" data-game-title="${response[i].GameTitle}">
                            <img src="${response[i].GameImage}" class="d-block w-100 h-auto" alt="Game ${i + 1}">
                        </div>`;
        carouselInner.append(itemHtml);
    }
    if (response.length <= 1) {
        $('#topGamesCarousel .carousel-control-prev, #topGamesCarousel .carousel-control-next').hide();
    }
});

$(document).on('click', '.clickable-carousel-item', function () {
    var gameTitle = $(this).data('game-title');
    window.location.href = 'specificgame.html?game=' + gameTitle;
});



$(document).ready(function () {
    var categorySettings = {
        "url": "http://localhost:3000/allCategories",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(categorySettings).done(function (response) {
        $('#category').empty();

        $('#category').append($('<option>', {
            value: "All",
            text: "All"
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

    var platformSettings = {
        "url": "http://localhost:3000/allPlatforms",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(platformSettings).done(function (response) {
        $('#platform').empty();

        $('#platform').append($('<option>', {
            value: "All",
            text: "All"
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

    $('#category').change(function () {
        localStorage.setItem('selectedCategory', $(this).val());
    });

    $('#platform').change(function () {
        localStorage.setItem('selectedPlatform', $(this).val());
    });

    $(window).on('beforeunload', function () {
        localStorage.removeItem('selectedCategory');
        localStorage.removeItem('selectedPlatform');
    });
});



function generateCard(game) {
    return `
            <div class="col-md-4">
                <div class="card shadow-sm clickable-element" data-game-title="${game.title}">
                    <img src="${game.image}" class="bd-placeholder-img card-img-top" alt="Game Image">
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li><strong>Name:</strong> ${game.title}</li>
                            <li><strong>Platform(s):</strong> ${game.platform_name}</li>
                            <li><strong>Category(s):</strong> ${game.catname}</li>
                            <li><strong>Published Year:</strong> ${game.year}</li>
                            <li><strong>Description:</strong> ${game.description}</li>
                            <li><strong>Price:</strong> ${game.price}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}

function loadGames(settings) {
    $.ajax(settings)
        .done(function (response) {
            var cardHTML = '<div class="row">';
            var row_counter = 0;

            for (var i = 0; i < response.length; i++) {
                cardHTML += generateCard(response[i]);
                row_counter++;
                if (row_counter % 3 === 0) {
                    cardHTML += '</div><div class="row">';
                }
            }

            if (!cardHTML.endsWith('</div>')) {
                cardHTML += '</div>';
            }

            $('#cardContainer').html(cardHTML);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                $('#cardContainer').html('<h4>No Games Available</h4>');
            } else {
                console.log(textStatus, errorThrown);
                $('#cardContainer').html('<h4>An error occurred while fetching the games.</h4>');
            }
        });
}

$(document).ready(function () {
    var settingsAllGames = {
        "url": "http://localhost:3000/allGames",
        "method": "GET",
        "timeout": 0,
    };

    loadGames(settingsAllGames);

    $('.search-form').on('submit', function (event) {
        event.preventDefault();

        var formData = $(this).serialize(); // convert into those like URL thingies

        var settings = {
            "url": "http://localhost:3000/filterGames?" + formData,
            "method": "GET",
            "timeout": 0,
        };


        $.ajax(settings)
            .done(function (response) {
                var cardHTML = '<div class="row">';
                var row_counter = 0;

                for (var i = 0; i < response.length; i++) {
                    cardHTML += generateCard(response[i]);
                    row_counter++;
                    if (row_counter % 3 === 0) {
                        cardHTML += '</div><div class="row">';
                    }
                }

                if (!cardHTML.endsWith('</div>')) {
                    cardHTML += '</div>';
                }

                $('#cardContainer').html(cardHTML);


            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    $('#cardContainer').html('<h4>No Games Available</h4>');
                } else {
                    console.log(textStatus, errorThrown);
                    $('#cardContainer').html('<h4>An error occurred while fetching the games.</h4>');
                }
            });
    });

    $(document).on('click', '.card', function () {
        var gameId = $(this).data('game-title');
        window.location.href = 'specificgame.html?game=' + gameId;
    });
});