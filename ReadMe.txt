## Introduction: This is my Back end development assignment. I was tasked to:
1. Create the front-end web application
2. Modify MySQL database to be many-to-many relationship
3. Configure a persistent login and logout
4. Filter displayed games
5. View game details, reviews and ratings.
6. Ensure only registered members were allowed to add reviews.
7. Only admins could add new games and platforms.
8. Ensure necessary JWT checking for access rights.

## Installation:  
1. run the command "npm init" to initialize the project.
2. Ensure you have 'NodeJS' installed.
3. Install the required resources using the following commands:
    - 'npm install express'
    - 'npm install mysql2'
    - 'npm install nodemon'
    - 'npm install multer'
    - 'npm install jsonwebtoken'

## Configuration:
1. Edit "package.json" and add ("serve": "nodemon index.js") under scripts.
2. Ensure you have MySQL WORKBENCH installed, run BEDAS2.sql in MySQL WORKBENCH.
3. Ensure that "databaseConfig.js" credentials are configured your MySQL credentials

## Usage:
1. Open the folder in Visual Studio Code (VSC)
1. Right click an empty space under the Folder in VSC and click "Open in integrated terminal"
2. Type "npm run serve" in the newly opened terminal to run the server.