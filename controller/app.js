const express = require("express");
const gamesDB = require("../model/spgames");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const app = express();
const bodyParser = require('body-parser');
app.use(express.static("./public"));
app.use(express.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());


const fs = require('fs');

const path = require('path');

const multer = require('multer');

const userStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/profileimages')
    },
    filename: (req, file, callback) => {
        const userid = req.credentials.userid;
        const newFilename = userid + path.extname(file.originalname);
        const fullPath = './public/profileimages/' + newFilename;

        // Check if the file exists and remove it
        fs.access(fullPath, error => {
            if (!error) {
                // The file exists, remove it
                fs.unlink(fullPath, err => {
                    if (err) throw err;
                    console.log(fullPath + ' was deleted');
                    // Once the file is deleted, you can go ahead and save the new file
                    callback(null, newFilename);
                });
            } else {
                // The file doesn't exist, you can go ahead and save the new file
                callback(null, newFilename);
            }
        });
    }
});

const gameStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/gameimages/')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const userFileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const gameFileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const uploadUser = multer({
    storage: userStorage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: userFileFilter
});

const uploadGame = multer({
    storage: gameStorage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: gameFileFilter
}).single('image');


function verifyToken(req, res, next) {
    var token = req.headers["authorization"];
    //"Bearer ey3ijasdfoiadsf.jzdfz...."
    console.log(token);

    if (!token || !token.includes("Bearer ")) {
        res.status(403).send({
            "message": "Bearer Token not supplied/found"
        })
    } else {
        token = token.split("Bearer ")[1];
        var now = Date.now();
        // Only added this cause ugly TypeError message in console
        try {
            var decodedToken = jwt.decode(token);
            var exp = decodedToken.exp * 1000;
            if (!decodedToken || !decodedToken.exp || now > exp) {
                res.status(401);
                res.send({ message: "Access token has expired." })
            } else {
                jwt.verify(token, keys.JWTSecretKey, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log(result);
                        //role: xxx
                        req.credentials = result;
                        next();
                    }
                });
            }
        } catch (err) {
            res.status(400);
            // res.send({message: "your mother token"})
            res.send({ message: "Invalid Token" })
        }
    }
}

// used to check if token is valid and not ownself add in jwt in local storage
app.get('/auth/validateToken', verifyToken, function (req, res) {
    res.status(200).send({
        message: "Token is valid"
    });
});

// Endpoint 2
app.post("/users", (req, res) => {
    const userObj = req.body;

    // makes it lower case so test@gmail.com and Test@gmail.com doesn't count as the same thing lol
    const lowercaseEmail = userObj.email.toLowerCase();

    // Check if valid email
    if (!gamesDB.checkValidEmail(userObj.email)) {
        res.status(400);
        res.send({ message: "Invalid email format" });
        return;
    }

    //Check if Valid passwrod
    if (!gamesDB.checkValidPassword(userObj.password)) {
        res.status(400);
        res.send({ message: "Invalid password format" });
        return;
    }

    //Check if existing email then proceed with POST request
    gamesDB.checkEmail(lowercaseEmail, (err, result) => {
        if (err) {
            res.status(500);
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else if (result.length > 0) {
            res.status(422);
            res.send({ message: "Unprocessable Entity" });
        } else {
            gamesDB.createUser(userObj, (err, result) => {
                if (err) {
                    res.status(500);
                    console.log(err);
                    res.send({ message: "Internal Server Error" });
                } else {
                    res.status(200);
                    res.send({ message: "User ID " + result.insertId });
                }
            })
        }
    });
})

// Endpoint 4
app.post("/category", verifyToken, (req, res) => {
    gamesDB.checkCategory(req.body.catname, (err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
            // Checks if Category arleady exists
        } else if (result.length > 0) {
            res.status(409);
            res.send({ message: "Duplicate Entry" });
        } else {
            gamesDB.createCategory(req.body.catname, req.body.description, (err, result) => {
                if (err) {
                    res.status(500);
                    res.send({ message: "Internal Server Error" });
                } else {
                    res.status(201);
                    res.send({ message: "Category created successfully." });
                }
            });
        }
    });
});

// Endpoint 5
app.post("/platform", verifyToken, (req, res) => {
    gamesDB.checkPlatform(req.body.platform_name, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500);
            res.send({ message: "Internal Server Error" });
            // checks if platform already exists
        } else if (result.length > 0) {
            res.status(409);
            console.log(err)
            res.send({ message: "Duplicate Entry" });
        } else {
            gamesDB.createPlatform(req.body.platform_name, req.body.description, (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500);
                    res.send({ message: "Internal Server Error" });
                } else {
                    console.log(err)
                    res.status(201);
                    res.send({ message: "Platform created successfully." });
                }
            });
        }
    });
});


// Endpoint 8
app.delete("/game/:id", verifyToken, (req, res) => {
    const gameId = parseInt(req.params.id);

    // checks if game id is valid
    if (!Number.isInteger(gameId) || gameId <= 0 || isNaN(gameId)) {
        res.status(400);
        res.send({ message: "Invalid Game ID" });
        return;
    }
    gamesDB.deleteGameById(gameId, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            // checks if game id exists
            if (result.gameAffectedRows === 0) {
                res.status(404);
                res.send({ message: "Game ID " + req.params.id + " not found." });
            } else {
                console.log(err);
                res.status(204);
                res.send({ message: "No Content." });
            }
        }
    })
});


// Endpoint 12 get top games' image title
app.get("/topGames", (req, res) => {
    gamesDB.getTopThreeGames((err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            console.log(err);
            res.status(200);
            res.send(result);
        }
    });
});

// Delete category by catname
app.delete("/category", verifyToken, (req, res) => {
    const catname = req.body.catname;

    gamesDB.deleteCategory(catname, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            if (result.categoryAffectedRows === 0) {
                res.status(404);
                res.send({ message: "Category " + catname + " not found." });
            } else {
                res.status(200);
                res.send({ message: "Categpry " + catname + " deleted." });
            }
        }
    });
});

// Delete platfomr by paltofmr_name
app.delete("/platform", verifyToken, (req, res) => {
    const platform_name = req.body.platform_name;

    gamesDB.deletePlatform(platform_name, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            if (result.platformAffectedRows === 0) {
                res.status(404);
                res.send({ message: "Platform " + platform_name + " not found." });
            } else {
                res.status(200);
                res.send({ message: "Platform " + platform_name + " deleted." });
            }
        }
    });
});

// used to display games for deletion
app.get("/gamesLike/:title", (req, res) => {
    const title = req.params.title;
    console.log(`${title}`)
    gamesDB.getGamesLike(title, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            if (result.length < 1) {
                res.status(404);
                res.send({ message: "No games found." });
            } else {
                res.status(200);
                res.send(result);
            }
        }
    });
});

// used to fill in form stuff
app.get("/allCategories", (req, res) => {
    gamesDB.getCategories((err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result.length < 1) {
            res.status(404);
            res.send({ message: "No Categories Found" });
        } else {
            res.status(200);
            res.send(result);
        }
    })
})

// used to fill in form stuff
app.get("/allPlatforms", (req, res) => {
    gamesDB.getPlatforms((err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result.length < 1) {
            res.status(404);
            res.send({ message: "No Platforms Found" });
        } else {
            res.status(200);
            res.send(result);
        }
    })
})

// for generating cards
app.get("/allGames", (req, res) => {
    gamesDB.getAllGames((err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result.length < 1) {
            res.status(404);
            res.send({ message: "No Games Found" });
        } else {
            // transform the data here before sending the response
            let transformedResult = result.map(game => {
                let prices = game.price.map(price => {
                    // If the price is zero, change it to "Free"
                    if (price == 0) {
                        return "Free";
                    }
                    // If the price is not zero, add "$" at the start and format to two decimal places
                    else {
                        return "$" + parseFloat(price).toFixed(2);
                    }
                });
                return {
                    ...game,
                    platform_name: game.platform_name.join(', '),
                    catname: game.catname.join(', '),
                    price: prices.join(', ')
                };
            });

            res.status(200);
            res.send(transformedResult);
        }
    });
});

// searhc filter
app.get("/filterGames", (req, res) => {
    let filterObj = {
        title: req.query.gamename || '',
        platform: req.query.platform || 'All',
        category: req.query.category || 'All',
        maxPrice: req.query.max_price || Number.MAX_VALUE,
        minPrice: req.query.min_price || 0
    };

    gamesDB.filterGames(filterObj, (err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result.length < 1) {
            res.status(404);
            res.send({ message: "No Games Found" });
        } else {
            // transform the data here before sending the response
            let transformedResult = result.map(game => {
                let prices = game.price.map(price => {
                    // If the price is zero, change it to "Free"
                    if (price == 0) {
                        return "Free";
                    }
                    // If the price is not zero, add "$" at the start and format to two decimal places
                    else {
                        return "$" + parseFloat(price).toFixed(2);
                    }
                });
                return {
                    ...game,
                    platform_name: game.platform_name.join(', '),
                    catname: game.catname.join(', '),
                    price: prices.join(', ')
                };
            });
            console.log(transformedResult)
            res.status(200);
            res.send(transformedResult);
        }
    });
});

// specificgame page
// app.get("/specificgame/:name", (req, res) => {
//     const gameName = req.params.name;
//     console.log(`${gameName}`)
//     // checks if game name is provided
//     if (!gameName || gameName.trim().length === 0) {
//         res.status(400);
//         res.send({ message: "Invalid Game Name" });
//         return;
//     }

//     gamesDB.getGameByName(req.params.name, (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(500);
//             res.send({ message: "Internal Server Error" });

//             // checks if game name exists
//         } else if (!result.game_id) {
//             res.status(404);
//             res.send({ message: "Game named \"" + req.params.name + "\" not found." });
//         } else {
//             // Add review_rating to each review object
//             let transformedReviews = result.reviews.map(review => ({
//                 review_content: review.review_content,
//                 review_author: review.review_author,
//                 review_rating: review.review_rating
//             }));

//             let prices = result.game_price.map(price => {
//                 // If the price is zero, change it to "Free"
//                 if (price == 0) {
//                     return "Free";
//                 }
//                 // If the price is not zero, add "$" at the start and format to two decimal places
//                 else {
//                     return "$" + parseFloat(price).toFixed(2);
//                 }
//             });

//             // Create a new transformedResult object with updated reviews
//             let transformedResult = {
//                 game_id: result.game_id,
//                 game_image: result.game_image,
//                 game_title: result.game_title,
//                 platform_name: result.game_platform.join(', '),
//                 catname: result.game_category.join(', '),
//                 game_year: result.game_year,
//                 game_description: result.game_description,
//                 price: prices.join(', '),
//                 reviews: transformedReviews
//             };

//             res.status(200);
//             res.send(transformedResult);
//         }
//     });
// });

app.get("/specificgame/:name", (req, res) => {
    const gameName = req.params.name;
    console.log(`${gameName}`)
    // checks if game name is provided
    if (!gameName || gameName.trim().length === 0) {
        res.status(400);
        res.send({ message: "Invalid Game Name" });
        return;
    }

    gamesDB.getGameByName(req.params.name, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });

            // checks if game name exists
        } else if (!result.game_id) {
            res.status(404);
            res.send({ message: "Game named \"" + req.params.name + "\" not found." });
        } else {
            // making it look nicer
            let prices = result.game_price.map(price => {
                // If the price is zero, change it to "Free"
                if (price == 0) {
                    return "Free";
                }
                // If the price is not zero, add "$" at the start and format to two decimal places
                else {
                    return "$" + parseFloat(price).toFixed(2);
                }
            });

            // Create a new transformedResult object with updated reviews
            let transformedResult = {
                game_id: result.game_id,
                game_image: result.game_image,
                game_title: result.game_title,
                platform_name: result.game_platform.join(', '),
                catname: result.game_category.join(', '),
                game_year: result.game_year,
                game_description: result.game_description,
                price: prices.join(', '),
                reviews: result.reviews
            };

            res.status(200);
            res.send(transformedResult);
        }
    });
});


app.post("/login", (req, res) => {
    gamesDB.authenticate(req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.status.send();
        } else {
            if (result.length > 0) {
                console.log(result);
                var payload = result[0];
                var token = jwt.sign(payload, keys.JWTSecretKey,
                    { expiresIn: "1h" }
                );

                res.send({
                    "token": token
                });
            } else {
                res.send({
                    "message": "email / password not found"
                })
            }
        }
    });
})

// used for many many things, get username, usertype, user id
app.get("/profile", verifyToken, (req, res) => {

    res.send({
        "message": "This is your profile.",
        "credentials": req.credentials
    });
});

// used to update user profile
app.put("/profile", verifyToken, (req, res) => {
    gamesDB.updateUser(req.credentials.userid, req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(200);
            res.send({ message: "User updated successfully." });
        }
    });
});

// gets user profile picture
app.get("/profilePFP", verifyToken, (req, res) => {
    const userId = req.credentials.userid;
    console.log("User ID: " + userId)

    gamesDB.retrievePFP(userId, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            console.log(err);
            res.status(200);
            res.send(result);
        }
    });
});

// updating user profile picture
app.post("/uploadPFP", verifyToken, uploadUser.single('image'), (req, res) => {
    const file = req.file;
    const userid = req.credentials.userid;
    const filePath = '../profileimages/' + userid + path.extname(file.originalname);

    if (!file) {
        res.status(400);
        res.send("Error uploading file, please make sure image is Jpg/Jpeg and less than 1MB")
    } else {
        gamesDB.saveUserFilePath(userid, filePath, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.send("Error updating user profile picture path in the database");
            } else {
                res.status(200);
                res.send("File uploaded and path updated successfully");
            }
        });
    }
});

// multer stuff
app.use(function (err, req, res, next) {
    console.log(err);
    console.log(err.code);
    console.log(err.message);

    if (err instanceof multer.MulterError) {
        // making console cleaner from long ugly error message
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400);
            res.send("Error uploading file. Please make sure the image size is less than 1MB.");
        } else {
            res.status(400);
            res.send("Error uploading file. Please make sure the image is in Jpg/Jpeg format.");
        }
    } else {
        next(err);
    }
});

// upload game image
app.post("/uploadGameImage", verifyToken, uploadGame, (req, res) => {
    const file = req.file;
    const gameId = req.body.gameid;

    const originalFilePath = './public/gameimages/' + file.filename;
    const newFileName = gameId + path.extname(file.originalname);
    const newFilePath = './public/gameimages/' + newFileName;

    if (!file) {
        res.status(400).send("Error uploading file, please make sure image is Jpg/Jpeg and less than 1MB");
    } else {
        fs.rename(originalFilePath, newFilePath, (err) => {
            if (err) {
                console.log('Error renaming file: ', err);
                res.status(500).send("Error renaming the file");
            } else {
                const relativeNewFilePath = '../gameimages/' + newFileName;
                gamesDB.saveGameFilePath(gameId, relativeNewFilePath, (err, result) => {
                    if (err) {
                        console.log('Error saving file path to database: ', err);
                        res.status(500).send("Error updating game image path in the database");
                    } else {
                        res.status(200).send("File uploaded and path updated successfully");
                    }
                });
            }
        });
    }
});


// create review
app.post("/createReview", verifyToken, (req, res) => {
    const reqReviewObj = req.body.reviewObj;
    const reviewObj = {
        content: reqReviewObj.reviewText,
        rating: reqReviewObj.rating
    }
    const userId = req.credentials.userid;
    const gameId = reqReviewObj.gameId;
    gamesDB.createReview(userId, gameId, reviewObj, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(201);
            res.send({ message: "Review created successfully." });
        }
    });
});

// delete old reivew if adding new one
app.delete("/deleteReview", verifyToken, (req, res) => {
    const userId = req.credentials.userid;
    const gameId = req.body.gameId; 

    gamesDB.deleteReviewById(userId, gameId, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result.reviewAffectedRows > 0) {
            res.status(200);
            res.send({ message: "Review deleted successfully." });
        } else {
            res.status(404);
            res.send({ message: "Review not found." });
        }
    });
});

// check if theres a user review for specific game
app.get("/checkReview/:uid/:gid", verifyToken, (req, res) => {
    const userId = req.params.uid;
    const gameId = req.params.gid;

    gamesDB.checkReviewExists(userId, gameId, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result.length > 0) {
            res.status(200);
            res.send({ message: "Review exists." });

        } else {
            res.status(200);
            res.send({ message: "Review does not exist." });
        }
    });
});

// add new game
app.post("/addGame", verifyToken, (req, res) => {
    const gameObj = req.body;
    console.log(gameObj);

    gamesDB.addIntoGames(gameObj, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(201);
            res.send({ message: "Game added successfully." });
        }
    });
});

// get game id by title
app.get("/getGameId/:title", verifyToken, (req, res) => {
    const title = req.params.title;

    gamesDB.getGameIdByTitle(title, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(200);
            res.send(result);
        }
    });
});

// add game's category
app.post("/addGameCategory", verifyToken, (req, res) => {
    const gameObj = req.body;
    console.log(gameObj);

    gamesDB.addIntoGameCategory(gameObj, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(201);
            res.send({ message: "Game category added successfully." });
        }
    });
});

// add game's platform
app.post("/addGamePlatform", verifyToken, (req, res) => {
    const gameObj = req.body;
    console.log(gameObj);

    gamesDB.addIntoGamePlatform(gameObj, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(201);
            res.send({ message: "Game platform added successfully." });
        }
    });
});

// for when user wants to update password, must make sure old password is correct
app.get("/checkPassword", verifyToken, (req, res) => {
    const userId = req.credentials.userid;
    const password = req.query.password;

    gamesDB.getPasswordById(userId, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: "An error occurred." });
        } else if (result && result.password === password) {
            res.status(200).send({ message: "Password matches." });
        } else {
            res.status(200).send({ message: "Password does not match." });
        }
    });
});


module.exports = app;