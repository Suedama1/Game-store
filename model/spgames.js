const dbConnect = require("./dbConnect");
const gamesDB = {};


gamesDB.createCategory = (catname, description, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    const sqlStmt =
        'INSERT INTO `spgames`.`category` (`catname`, `description`) VALUES (?, ?)';

    conn.query(sqlStmt, [catname, description], (err, result) => {
        //4 - End the DB Connection
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

gamesDB.checkCategory = (catname, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statement
    const sqlStmt = 'SELECT * FROM `spgames`.`category` WHERE `catname` = ?';

    //3 - Execute the Statement with Connection
    conn.query(sqlStmt, [catname], (err, result) => {

        //4 - End the DB Connection
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
}

gamesDB.createPlatform = (platformname, description, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statement
    const sqlStmt = 'INSERT INTO `spgames`.`platform` (`platform_name`, `description`) VALUES (?, ?)';

    //3 - Execute the Statement with Connection
    conn.query(sqlStmt, [platformname, description], (err, result) => {

        //4 - End the DB Connection
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }

    })
};

gamesDB.checkPlatform = (platformname, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statement
    const sqlStmt = 'SELECT * FROM `spgames`.`platform` WHERE `platform_name` = ?';

    //3 - Execute the Statement with Connection
    conn.query(sqlStmt, [platformname], (err, result) => {

        //4 - End the DB Connection
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
};


gamesDB.deleteGameById = (id, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statements
    const deleteGameSqlStmt = 'DELETE FROM `spgames`.`game` WHERE `gameid` = ?';

    //3 - Execute the Statements with Connection


    conn.query(deleteGameSqlStmt, [id], (err, gameResult) => {
        //4 - End the DB Connection
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, { gameAffectedRows: gameResult.affectedRows });
        }
    });
};

gamesDB.createReview = (userId, gameId, reviewObj, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statement
    const sqlStmt =
        'INSERT INTO `spgames`.`review` (`content`, `rating`, `userid`, `gameid`) VALUES (?, ?, ?, ?)';

    //3 - Execute the Statement with Connection
    conn.query(sqlStmt, [reviewObj.content, reviewObj.rating, userId, gameId], (err, result) => {
        //4 - End the DB Connection
        conn.end();
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    }
    );
};

gamesDB.deleteReviewById = (userId, gameId, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statements
    const deleteReviewSqlStmt = 'DELETE FROM `spgames`.`review` WHERE `userid` = ? AND `gameid` = ?';

    //3 - Execute the Statements with Connection
    conn.query(deleteReviewSqlStmt, [userId, gameId], (err, reviewResult) => {

        //4 - End the DB Connection
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, { reviewAffectedRows: reviewResult.affectedRows });
        }
    }
    );
};

gamesDB.checkReviewExists = (userId, gameId, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statement
    const sqlStmt = 'SELECT reviewid FROM spgames.review WHERE userid = ? AND gameid = ?';

    //3 - Execute the Statement with Connection
    conn.query(sqlStmt, [userId, gameId], (err, result) => {
        //4 - End the DB Connection
        conn.end();
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};


gamesDB.deleteCategory = (catname, callback) => {

    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statements
    const deleteCategorySqlStmt = 'DELETE FROM `spgames`.`category` WHERE `catname` = ?';

    //3 - Execute the Statements with Connection
    conn.query(deleteCategorySqlStmt, [catname], (err, categoryResult) => {

        //4 - End the DB Connection
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, { categoryAffectedRows: categoryResult.affectedRows });
        }
    });
};


gamesDB.deletePlatform = (platformname, callback) => {
    //1 - Setup Connection
    const conn = dbConnect.getConnection();

    //2 - Define SQL statements
    const deletePlatformSqlStmt = 'DELETE FROM `spgames`.`platform` WHERE `platform_name` = ?';

    //3 - Execute the Statements with Connection
    conn.query(deletePlatformSqlStmt, [platformname], (err, platformResult) => {

        //4 - End the DB Connection
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, { platformAffectedRows: platformResult.affectedRows });
        }
    });
};




// NEW ENDPOINTS FOR CA2

// Modified to just get the game images and title
gamesDB.getTopThreeGames = (callback) => {
    const conn = dbConnect.getConnection();

    // just get the image and title of the game
    // get the review and average by descending order and limit to 3
    const sqlStmt =
        `SELECT g.image as GameImage, g.title as GameTitle
        FROM spgames.review AS r 
        JOIN spgames.game AS g ON r.gameid = g.gameid
        GROUP BY g.image, g.title
        ORDER BY AVG(r.rating) DESC
        LIMIT 3`;


    conn.query(sqlStmt, (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}


gamesDB.getCategories = (callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt = 'SELECT catname, catid FROM spgames.category';

    conn.query(sqlStmt, [], (err, result) => {

        //4 - End the DB Connection
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

gamesDB.getPlatforms = (callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt = 'SELECT platform_name, platformid FROM spgames.platform';

    conn.query(sqlStmt, [], (err, result) => {

        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

gamesDB.getAllGames = (callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =
        `SELECT
        g.gameid,
        g.image,
        g.title,
        g.description,
        g.year,
        p.platform_name,
        c.catname,
        gp.price
    FROM 
        spgames.game AS g
    JOIN 
        spgames.gameprice AS gp ON g.gameid = gp.gameid
    JOIN
        spgames.platform AS p ON gp.platformid = p.platformid
    JOIN
        spgames.gamecategory AS gc ON g.gameid = gc.gameid
    JOIN
        spgames.category AS c ON gc.gamecategoryid = c.catid`;

    conn.query(sqlStmt, (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            // inititalize empty object
            let games = {};
            // loop thru
            result.forEach(game => {
                // if haven't created object for this game yet create
                if (!games[game.title]) {
                    games[game.title] = {
                        gameid: game.gameid,
                        title: game.title,
                        image: game.image,
                        // array cuz can have multiple platforms
                        platform_name: [game.platform_name],
                        // array cuz can have multiple categories
                        catname: [game.catname],
                        year: game.year,
                        description: game.description,
                        // array cuz can have multiple prices
                        price: [game.price]
                    };
                } else {
                    // check if current platform is already in the array else push
                    if (!games[game.title].platform_name.includes(game.platform_name)) {
                        games[game.title].platform_name.push(game.platform_name);
                    }
                    // check if current category is already in the array else push
                    if (!games[game.title].catname.includes(game.catname)) {
                        games[game.title].catname.push(game.catname);
                    }
                    // check if current price is already in the array else push
                    if (!games[game.title].price.includes(game.price)) {
                        games[game.title].price.push(game.price);
                    }
                }
            });

            // converts all the objects into an array
            let transformedResult = Object.values(games);
            return callback(null, transformedResult);
        }
    })
}

gamesDB.filterGames = (filterObj, callback) => {
    const conn = dbConnect.getConnection();

    /*
    ok first initializes the short form of table names
    spgames.gameprice as gpr
    spgames.platform as p
    spgames.gamecategory as gc
    spgames.category as c

    then select the columns that you want and left join based on common values

    then where the search filter = ? or if the search filter is empty then just use the 'All' value 
    for the search one is either the like concat or the empty string so that it will return all the games

    */
    let sqlStmt =
        `SELECT
        spgames.game.gameid,
        spgames.game.image,
        spgames.game.title,
        spgames.game.description,
        spgames.game.year,
        p.platform_name,
        c.catname,
        gpr.price
    FROM 
        spgames.game 
    JOIN 
        spgames.gameprice AS gpr ON spgames.game.gameid = gpr.gameid
    JOIN
        spgames.platform AS p ON gpr.platformid = p.platformid
    JOIN
        spgames.gamecategory AS gc ON spgames.game.gameid = gc.gameid
    JOIN
        spgames.category AS c ON gc.gamecategoryid = c.catid
    WHERE 
        (spgames.game.title LIKE CONCAT('%', ?, '%') OR ? = '') 
    AND (p.platform_name = ? OR ? = 'All')  
    AND (c.catname = ? OR ? = 'All')  
    AND gpr.price <= ? 
    AND gpr.price >= ?`;

    conn.query(sqlStmt, [filterObj.title, filterObj.title, filterObj.platform, filterObj.platform, filterObj.category, filterObj.category, filterObj.maxPrice, filterObj.minPrice], (err, result) => {
        conn.end();
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            let games = {};
            // loop thru
            result.forEach(game => {
                // if haven't created object for this game yet create
                if (!games[game.title]) {
                    games[game.title] = {
                        gameid: game.gameid,
                        title: game.title,
                        image: game.image,
                        // array cuz can have multiple platforms
                        platform_name: [game.platform_name], 
                        // array cuz can have multiple categories
                        catname: [game.catname],
                        year: game.year,
                        description: game.description,
                        // array cuz can have multiple prices
                        price: [game.price]
                    };
                } else {
                    // check if current platform is already in the array else push
                    if (!games[game.title].platform_name.includes(game.platform_name)) {
                        games[game.title].platform_name.push(game.platform_name);
                    }
                    // check if current category is already in the array else push
                    if (!games[game.title].catname.includes(game.catname)) {
                        games[game.title].catname.push(game.catname);
                    }
                    // check if current price is already in the array else push
                    if (!games[game.title].price.includes(game.price)) {
                        games[game.title].price.push(game.price);
                    }
                }
            });

            // converts all the objects into an array
            let transformedResult = Object.values(games);
            return callback(null, transformedResult);
        }
    })
}



gamesDB.getGameByName = (name, callback) => {
    const conn = dbConnect.getConnection();


    /*
    ok first initializes the short form of table names
    spgames.game as g
    spgames.gameprice as gpri
    spgames.platform as p
    spgames.gamecategory as gc
    spgames.category as c
    spgames.review as r
    spgames.users as u

    then select the columns that you want and left join based on common values

    then where g.title = what we want :D

    */
    const sqlStmt =
        `SELECT 
        g.gameid AS game_id,
        g.image AS game_image,
        g.title AS game_title,
        p.platform_name AS game_platform,
        c.catname AS game_category,
        g.year AS game_year,
        g.description AS game_description,
        gpri.price AS game_price,
        r.content AS review_content,
        r.rating AS review_rating,
        u.username AS review_author
    FROM
        spgames.game g 
    LEFT JOIN 
        spgames.gameprice gpri ON g.gameid = gpri.gameid
    LEFT JOIN 
        spgames.platform p ON gpri.platformid = p.platformid
    LEFT JOIN 
        spgames.gamecategory gc ON g.gameid = gc.gameid
    LEFT JOIN 
        spgames.category c ON gc.gamecategoryid = c.catid
    LEFT JOIN 
        spgames.review r ON g.gameid = r.gameid
    LEFT JOIN 
        spgames.users u ON r.userid = u.userid    
    WHERE g.title = ?`;

    conn.query(sqlStmt, [name], (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            let game = {};
            // loop thru
            result.forEach(row => {
                // check if game object has been created
                if (!game.game_id) {
                    // create the game object
                    game = {
                        game_id: row.game_id,
                        game_image: row.game_image,
                        game_title: row.game_title,
                        // array cuz can have multiple platforms
                        game_platform: [row.game_platform],
                        // array cuz can have multiple categories
                        game_category: [row.game_category],
                        game_year: row.game_year,
                        game_description: row.game_description,
                        // array cuz can have multiple prices
                        game_price: [row.game_price],
                        // create the reviews array
                        reviews: []
                    };
                    // add stuff into the reviews array in the current row
                    if (row.review_content) {
                        game.reviews.push({
                            review_content: row.review_content,
                            review_author: row.review_author,
                            review_rating: row.review_rating
                        });
                    }
                } else {
                    // checks if current game object has this platform alr if not push 
                    if (!game.game_platform.includes(row.game_platform)) {
                        game.game_platform.push(row.game_platform);
                    }
                    // checks if current game object has this category alr if not push
                    if (!game.game_category.includes(row.game_category)) {
                        game.game_category.push(row.game_category);
                    }
                    // checks if current game object has this price alr if not push
                    if (!game.game_price.includes(row.game_price)) {
                        game.game_price.push(row.game_price);
                    }
                    // checks if current row has review content if yes push into reviews array
                    // works cuz check once can already, if check again would be duplicate for the multiple platforms blablalba
                    if (row.review_content) {
                        game.reviews.push({
                            review_content: row.review_content,
                            review_author: row.review_author,
                            review_rating: row.review_rating
                        });
                    }
                }
            });
            // return the game object with all the stuff
            return callback(null, game);
        }
    });
};


// Modified for register page
gamesDB.createUser = (userObj, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt = 'INSERT INTO `spgames`.`users` (`username`, `email`, `password`) VALUES (?, ?, ?)';
    conn.query(sqlStmt, [userObj.username, userObj.email, userObj.password], (err, result) => {

        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

gamesDB.checkEmail = (email, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt = 'SELECT * FROM `spgames`.`users` WHERE LOWER(`email`) = ?';

    conn.query(sqlStmt, [email], (err, result) => {

        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
}

gamesDB.checkValidEmail = (email) => {
    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
    // https://emailregex.com/index.html
    const emailRegex = /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return emailRegex.test(email);
}

gamesDB.checkValidPassword = (password) => {
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

gamesDB.authenticate = function (userDetails, callback) {

    var sqlStmt = "SELECT userid, username, type FROM spgames.users WHERE email = ? AND password = ?";

    var conn = dbConnect.getConnection();

    conn.query(sqlStmt, [userDetails.email, userDetails.password], (err, result) => {
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result)
        }
    })
}


gamesDB.updateUser = (userId, userObj, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt = 'UPDATE `spgames`.`users` SET `username` = ?, `password` = ?  WHERE (`userid` = ?)';


    conn.query(sqlStmt, [userObj.username, userObj.password, userId], (err, result) => {

        conn.end();

        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

gamesDB.retrievePFP = (userId, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt = 'SELECT profile_pic_url FROM spgames.users WHERE userid = ?';

    conn.query(sqlStmt, [userId], (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result[0]);
        }
    })
}


gamesDB.getGamesLike = (title, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =
        `SELECT gameid, title
        FROM spgames.game
        WHERE title LIKE CONCAT ('%', ?, '%')`;

    conn.query(sqlStmt, [title], (err, result) => {
        conn.end();
        console.log(result);
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

gamesDB.addIntoGames = (gameObj, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =

        `INSERT INTO spgames.game (title, description, year) VALUES (?, ?, ?)`;

    conn.query(sqlStmt, [gameObj.title, gameObj.description, gameObj.year], (err, result) => {
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

gamesDB.getGameIdByTitle = (title, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =
        `SELECT gameid FROM spgames.game WHERE title = ?`;

    conn.query(sqlStmt, [title], (err, result) => {
        conn.end();
        console.log(result);
        if (err) {
            return callback(err, null);
        } else {

            return callback(null, result[0]);
        }
    });
};


gamesDB.addIntoGamePlatform = (gameObj, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =

        `INSERT INTO spgames.gameprice (gameid, price, platformid) VALUES (?, ?, ?)`;

    conn.query(sqlStmt, [gameObj.gameid, gameObj.price, gameObj.platformid], (err, result) => {

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};


gamesDB.addIntoGameCategory = (gameObj, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =

        `INSERT INTO spgames.gamecategory (gameid, gamecategoryid) VALUES (?, ?)`;

    conn.query(sqlStmt, [gameObj.gameid, gameObj.gamecategoryid], (err, result) => {

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

gamesDB.saveUserFilePath = (userId, filePath, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =
        `UPDATE spgames.users SET profile_pic_url = ? WHERE userid = ?`;

    conn.query(sqlStmt, [filePath, userId], (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

gamesDB.saveGameFilePath = (gameId, filePath, callback) => {

    const conn = dbConnect.getConnection();

    const sqlStmt =

        `UPDATE spgames.game SET image = ? WHERE gameid = ?`;

    conn.query(sqlStmt, [filePath, gameId], (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

gamesDB.getPasswordById = (userId, callback) => {
    const conn = dbConnect.getConnection();

    const sqlStmt =
        `SELECT password FROM spgames.users WHERE userid = ?`;

    conn.query(sqlStmt, [userId], (err, result) => {
        conn.end();
        if (err) {
            return callback(err, null);
        } else {

            return callback(null, result[0]);
        }
    });
};



module.exports = gamesDB;