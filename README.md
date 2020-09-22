# Min-Sudoku

## About

Sudoku is a logic-based, combinatorial number-placement puzzle. In classic sudoku, the objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids that compose the grid contain all of the digits from 1 to 9. The application featured here is a web game that allows you to play Sudoku online.

### Features

1. **Dark/Light Mode** - Adjust the theme based on your preference/environment.
2. **Easy, Medium, and Hard Difficulty** - Play at your preferred difficulty.
3. **Import Custom Sudoku** - Play any Sudoku you want (ex: NYT daily Sudokus).
4. **Sudoku Share** - Send a link to your friends so you can play the same Sudoku.
5. **Notes Mode** - Insert potential solutions for each Sudoku square.
6. **Cookie Save State** - Saves Sudoku progress despite closing out window.

## Development

### Frontend

The frontend was developed using vanilla JavaScript with styling done in CSS. The Sudoku grid is displayed using HTML5 canvas, which seamlessly integrates into browsers and eliminates the need for flash player. The application is optimized for all browsers as well as mobile devices. The JavaScript for this application was structured as follows:
* app.js - Contains all of the game logic and makes requests to the server.
* draw.js - Draws and updates the Sudoku grid when a change is detected.
* input.js - Handles all of the input for the game (clicks + keyboard events).

*Libraries used: Icons - Font Awesome, Clipboard functionality - clipboard.js.*

### Backend

Having a backend server for this project was necessary because generating Sudoku puzzles is very resource intensive. A computer can create a random Sudoku puzzle very quickly, but in order to generate a good puzzle, you must use human solving techniques to gauge difficulty. Furthermore, a good Sudoku is one that requires no guessing in order to find the solution. Therefore, it is much more logical to pre-generate many Sudoku puzzles and host them on a server. Additionally, the use of a server allows for users to be able to share Sudokus with friends, which was implemented in this application.

The backend of the project is implemented using PHP and Python. The PHP code is stored on the server and allows users to make database requests. The Python code is stored locally and allows the admin to upload Sudoku puzzles to the server. The backend repository is hosted on Heroku and can be viewed here: https://github.com/antonbezr/Min-Sudoku-Backend.

## Demo

<p align="center">
    Link to the app: https://min-sudoku.netlify.app (server will take a minute to start up).
</p>

<p align="center">
  <img src="https://i.imgur.com/NRhqbUp.png" width="45%" height="45%">
  <img src="https://i.imgur.com/uEEWylT.png" width="45%" height="45%">
</p>

<p align="center">
  <img src="https://i.imgur.com/q1VxH9D.png" width="45%" height="45%">
  <img src="https://i.imgur.com/x87JcWd.png" width="45%" height="45%">
</p>
