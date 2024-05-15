

document.addEventListener("DOMContentLoaded", function () {

    function createReview(userId, gameId, reviewText, rating) {
        $.ajax({
            url: 'http://localhost:3000/createReview',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            data: JSON.stringify({
                reviewObj: {
                    gameId: gameId,
                    reviewText: reviewText,
                    rating: rating
                }
            }),
            success: function (data) {
                console.log('Review created successfully: ' + data.message);
                location.reload();
            },
            error: function (jqXHR, status, error) {
                console.log('Error creating review: ', error);
            }
        });
    }


    function checkReviewExists(gameId, userId, reviewText, rating) {
        console.log(userId);
        console.log(gameId);
        $.ajax({
            url: 'http://localhost:3000/checkReview/' + userId + '/' + gameId,
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            success: function (data) {
                // console.log(data);
                if (data.message === "Review exists.") {
                    deleteReview(userId, gameId, function () {
                        createReview(userId, gameId, reviewText, rating);
                    });
                } else if (data.message === "Review does not exist.") {
                    createReview(userId, gameId, reviewText, rating);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error checking review: ', errorThrown);
            }
        });
    }

    function deleteReview(userId, gameId, onSuccess) {
        $.ajax({
            url: 'http://localhost:3000/deleteReview',
            method: 'DELETE',
            contentType: 'application/json',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            data: JSON.stringify({ userId: userId, gameId: gameId }),
            success: function (data) {
                console.log('Review deleted successfully: ' + data.message);
                onSuccess();
            },
            error: function (jqXHR, status, error) {
                console.log('Error deleting review: ', error);
            }
        });
    }

    let params = new URLSearchParams(window.location.search);
    let gameName = params.get('game');

    $.ajax({
        url: 'http://localhost:3000/specificgame/' + gameName,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            document.getElementById('game_id').value = data.game_id;
            document.getElementById('game_title').innerText = data.game_title;
            document.getElementById('game_image').src = data.game_image;
            document.getElementById('game_platform').innerText = data.platform_name;
            document.getElementById('game_category').innerText = data.catname;
            document.getElementById('game_year').innerText = data.game_year;
            document.getElementById('game_description').innerText = data.game_description;
            document.getElementById('game_price').innerText = data.price;

            if (data.reviews.length === 0) {
                let reviewsElement = document.getElementById('reviews');
                let noReviewsMessage = document.createElement('p');
                noReviewsMessage.innerText = 'No Reviews found.';
                reviewsElement.appendChild(noReviewsMessage);
                return;
            }
            function getStarRating(rating) {
                let fullStars = '★'.repeat(rating);
                let emptyStars = '☆'.repeat(5 - rating);
                return fullStars + emptyStars;
            }

            let reviewsElement = document.getElementById('reviews');
            let addedAuthors = [];
            for (let i = 0; i < data.reviews.length; i++) {
                let review = data.reviews[i];
                if (!addedAuthors.includes(review.review_author)) {
                    let reviewContainer = document.createElement('div');
                    reviewContainer.classList.add('review-container', 'row');

                    let authorName = document.createElement('h3');
                    authorName.innerText = review.review_author;
                    reviewContainer.appendChild(authorName);

                    let reviewContent = document.createElement('p');
                    reviewContent.classList.add('col-md-8');
                    reviewContent.innerHTML = `- ${review.review_content}`;
                    reviewContainer.appendChild(reviewContent);

                    let starRating = document.createElement('span');
                    starRating.classList.add('col-md-4', 'text-md-end');
                    starRating.innerText = getStarRating(review.review_rating);
                    reviewContainer.appendChild(starRating);

                    reviewsElement.appendChild(reviewContainer);
                    addedAuthors.push(review.review_author);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let reviewsTitle = document.getElementById('reviews-title');
            if (reviewsTitle) {
                reviewsTitle.style.display = 'none';
            }
            let gameSection = document.querySelector('.game-section');
            let errorMessage = jqXHR.status === 400 ? "Invalid game Name." : jqXHR.status === 404 ? "Game not found." : "An error occurred while fetching the game data.";
            gameSection.innerHTML = `<p>Error: ${errorMessage}</p>`;
        }
    });

    document.getElementById("submit-button").addEventListener("click", function (event) {
        event.preventDefault();

        const userId = localStorage.getItem("userid");
        const gameId = document.getElementById("game_id").value;
        const reviewText = document.getElementById("exampleFormControlTextarea1").value;
        const rating = $('input[name="inlineRadioOptions"]:checked').val();


        if (!reviewText) {
            $('#review-error').text('Please enter a review');
            return;
        } else {
            $('#review-error').text('');
        }

        if (!rating) {
            $('#radio-error').text('Please select a rating');
            return;
        } else {
            $('#radio-error').text('');
        }

        checkReviewExists(gameId, userId, reviewText, rating);
    });
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
            var userid = response.credentials.userid;
            var username = response.credentials.username;
            var userType = response.credentials.type;
            // console.log(userType);
            localStorage.setItem('username', username);
            localStorage.setItem('userid', userid);
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

var jwt = localStorage.getItem('jwt');
if (jwt) {
    fetchUserProfiel(jwt);
}

$(document).ready(function () {
    var jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
        $.ajax({
            url: 'http://localhost:3000/auth/validateToken',
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + jwtToken);
            },
            success: function (data) {
                $('#review-section').show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log("login la idiot");
            }
        });
    }
});
