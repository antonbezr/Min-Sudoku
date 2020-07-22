# Min-Sudoku

## About

Sudoku is a logic-based, combinatorial number-placement puzzle. In classic sudoku, the objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids that compose the grid contain all of the digits from 1 to 9. The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a single solution.

## Features

1. Dark/Light theme - Adjust the theme based on your preference/environment.
2. Easy, Medium, and Hard difficulty - Play at your preferred difficulty.
3. Import custom Sudoku - Play any Sudoku you want (ex: NYT daily Sudokus).
4. Sudoku share - Send a link to your friends so you can play the same puzzle.
5. Notes mode - Insert potential solutions for each Sudoku square.
6. Cookie save state - Saves Sudoku progress despite closing out window.

## Backend

Having a backend server for this project was necessary because generating Sudoku puzzles is very resource intensive. A computer can create a random Sudoku puzzle very quickly, but in order to generate a good puzzle, you must use human solving techniques to gauge difficulty. Furthermore, a true Sudoku is one that requires no guessing in order to find the solution. Therefore, it is much more logical to pre-generate many Sudoku puzzles and host them on a server. Additionally, the use of a server allows for users to be able to share Sudokus with friends, which was implemented in this application.

The backend of the project is implemented using PHP and Python. The PHP code is stored on the server and allows users to make database requests. The Python code is stored locally and allows the admin to upload Sudoku puzzles to the server. The backend repository is hosted on Heroku and can be viewed here: https://github.com/antonbezr/Min-Sudoku-Backend.

## Demo
The game can be found here: https://min-sudoku.netlify.app/ (Server may take a few seconds to start up).
