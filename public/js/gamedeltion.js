

$(document).ready(function () {
    var jwtToken = localStorage.getItem('jwt');

    function deleteGame(gameid) {
        event.preventDefault();

        var settings = {
            "url": "http://localhost:3000/game/" + gameid,
            "method": "DELETE",
            "headers": {
                "Authorization": `Bearer ${jwtToken}`
            }
        };

        $.ajax(settings).done(function (response) {
            console.log('Game deleted successfully');
            // document.getElementById("del-title-success").innerText = 'Game selected has been deleted';
            var messageElement = document.getElementById("del-title-message");
            messageElement.innerText = 'Game selected has been deleted';
            messageElement.style.color = "green";
            $('#del-game-title').val('');
            $('#search-results').empty();

        }).fail(function (jqXHR, textStatus, error) {
            console.log("Error deleting game:", error);
        });
    }

    $('#search-game').on('click', function () {
        // document.getElementById("del-title-success").innerText = "";
        var messageElement = document.getElementById("del-title-message");
        messageElement.innerText = "";

        $('#search-results').empty();
        $('#del-title-error').text('');

        var title = $('#del-game-title').val().trim();
        // console.log(title);
        if (!title) {
            $('#del-title-error').text('Please enter a game');
            return;
        }

        var settings = {
            "url": "http://localhost:3000/gamesLike/" + title,
            "method": "GET",
            "headers": {
                "Authorization": `Bearer ${jwtToken}`
            }
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            $('#search-results').empty();
            var gameid = response[0].gameid;
            console.log(gameid);

            // loop thru and add delete button
            $.each(response, function (i, item) {
                var $deleteButton = $('<button class="delete-button">Delete</button>');
                $deleteButton.on('click', function (event) { deleteGame(item.gameid, event); });
                $('#search-results').append($('<div>').text(item.title).append($deleteButton));
            });
        }).fail(function (jqXHR, textStatus, error) {
            console.log("Error fetching games:", error);
            // document.getElementById("del-title-error").innerText = 'No games found.';
            messageElement.innerText = 'No games found.';
            messageElement.style.color = "red";
        });
    });
});