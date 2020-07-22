const CANVAS_SCALE = 2;

const root = document.documentElement;
const style = getComputedStyle(document.body);

const difficultyTxt = document.getElementById("difficulty");
const modeButton = document.getElementById("mode")
const newGameButton = document.getElementById("new-game");
const customButton = document.getElementById("custom");
const doneButton = document.getElementById("done");
const shareButton = document.getElementById("share-board");
const copy = document.getElementById("copy");
const copyText = document.getElementById("copy-txt");
const copyBtn = document.getElementById("copy-btn");
const newGameDifficulty = document.getElementById("new-game-difficulty");
const newGameEasy = document.getElementById("easy");
const newGameMedium = document.getElementById("medium");
const newGameHard = document.getElementById("hard");
const canvas = document.getElementById("board");
const numButtons = document.getElementsByClassName("num");
const notesButton = document.getElementById("notes");

new ClipboardJS('#copy-btn');

var encodedBoard = "";
var customId = 0;
var board = [];
var coords = [];

var darkMode = true;
var link = "";
var newGameMenu = false;
var customGame = false;
var copyTime = false;
var saveBoard = [];
var saveDifficulty = "";
var done = false;

var exportId = 0;
var boardAltered = true;
var uploaded = false;

var select = -1;
var notes = false;
var counter = 0;

class Tile {
   constructor(val, det) {
      this.val = val;
      this.det = det;
      this.guesses = [false, false, false,
         false, false, false,
         false, false, false
      ];
      this.err = false;
   }
}

class Coord {
   constructor(x, y, row, col, sqr) {
      this.x = x;
      this.y = y;
      this.loc = [row, col, sqr];
   }
}

/* GENERATES EMPTY COORDINATE LIST */
function generateCoords() {
   for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
         coords.push(new Coord(0, 0, i, j, Math.floor(i / 3) + "" + Math.floor(j / 3)));
      }
   }
}

/* GENERATES EMPTY BOARD */
function generateEmptyBoard() {
   board = [];
   for (let i = 0; i < 81; i++) board.push(new Tile(0, false));
}

function newGame(mode) {
   var xhr = new XMLHttpRequest();
   let id = Math.floor(Math.random() * 1000) + 1;
   let url = "https://frozen-lake-90320.herokuapp.com/new_game.php?var=" + mode + "," + id;
   xhr.open('GET', url, true);
   xhr.onload = function() {
      let boardStr = this.responseText;
      board = [];
      let offsetRand = Math.floor(Math.random() * 9);
      for (let i = 0; i < 81; i++) {
         if (boardStr.charAt(i) == 0) {
            board.push(new Tile(0, false));
         } else {
            let offsetVal = (parseInt(boardStr.charAt(i)) + offsetRand) % 9 + 1;
            board.push(new Tile(offsetVal, true));
         }
      }
      difficultyTxt.innerHTML = "<b>Difficulty: </b>" + mode.charAt(0).toUpperCase() + mode.slice(1);
      saveDifficulty = difficulty.innerHTML;
      boardAltered = true;
      update("board");
   }
   xhr.send();
}

/* RETURNS A COPY OF THE BOARD */
function makeBoardCopy(board) {
   let copyTiles = [];
   for (let i = 0; i < 81; i++) copyTiles.push(new Tile(board[i].val, board[i].det));
   return copyTiles;
}

/* VALIDATES SUDOKU BOARD */
function validateBoard(makingCustomBoard) {
   let seen = new Set();
   // Valdates board
   for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
         let index = i * 9 + j;
         let val = board[index].val;
         let valStr = "(" + val + ")";
         if (!makingCustomBoard) board[index].err = false;
         if (val > 0) {
            let row = valStr + i;
            let col = j + valStr;
            let sqr = Math.floor(i / 3) + valStr + Math.floor(j / 3);
            if (makingCustomBoard) {
               if (seen.has(row)) return false;
               else if (seen.has(col)) return false;
               else if (seen.has(sqr)) return false;
               else {
                  seen.add(row);
                  seen.add(col);
                  seen.add(sqr);
               }
            }
         }
      }
   }
   if (makingCustomBoard) return true;
   else { // Set error values to each tile if necessary
      for (let i = 0; i < 81; i++) {
         for (let j = 0; j < 81; j++) {
            if (board[i].val > 0 && i != j && board[i].val == board[j].val) {
               if (coords[i].loc[0] == coords[j].loc[0] ||
                  coords[i].loc[1] == coords[j].loc[1] ||
                  coords[i].loc[2] == coords[j].loc[2]) {
                  board[i].err = true;
               }
            }
         }
      }
   }
}

/* CACHE TILES, THEME, AND DIFFICULTY */
function createCookie() {
   let boardStr = "";
   for (let i = 0; i < 81; i++) {
      boardStr += board[i].val;
      if (board[i].det) boardStr += 1;
      else boardStr += 0;
      for (let j = 0; j < 9; j++) {
         if (board[i].guesses[j]) boardStr += 1;
         else boardStr += 0;
      }
   }
   boardStr = "board=" + boardStr;
   let optionsStr = "options=";
   if (darkMode) optionsStr += 1;
   else optionsStr += 0;
   optionsStr += difficulty.innerHTML;
   document.cookie = boardStr;
   document.cookie = optionsStr;
}

/* LOAD CACHED TILES, THEME, AND DIFFICULTY*/
function loadCookie(decodeSuccessful) {
   let allCookies = document.cookie.split('; ');

   let boardCookie = "";
   let optionsCookie = "";

   if (allCookies[0].startsWith("board=")) {
      boardCookie = allCookies[0];
      optionsCookie = allCookies[1];
   } else {
      boardCookie = allCookies[1];
      optionsCookie = allCookies[0];
   }
   if (!decodeSuccessful) {
      for (let i = 0; i < 81; i++) {
         board[i].val = parseInt(boardCookie.charAt(i * 11 + 6));
         if (boardCookie.charAt(i * 11 + 7) == 1) board[i].det = true;
         else board[i].det = false;
         for (let j = 0; j < 9; j++) {
            if (boardCookie.charAt(i * 11 + 8 + j) == 1) board[i].guesses[j] = true;
            else board[i].guesses[j] = false;
         }
      }
      difficultyTxt.innerHTML = optionsCookie.slice(9);
      saveDifficulty = difficultyTxt.innerHTML;
   }
   if (optionsCookie.charAt(8) == 0) {
      switchTheme();
   }
}

function importBoard() {
   if (customId != null && customId > 0 && customId <= 1000) {
      let xhr = new XMLHttpRequest();
      let url = "https://frozen-lake-90320.herokuapp.com/download_board.php?id=" + customId;
      xhr.open('GET', url, true);
      xhr.onload = function() {
         let importStr = this.responseText;
         for (let i = 0; i < 81; i++) {
            let tileVal = parseInt(importStr.charAt(i));
            if (tileVal > 0) {
               board[i].val = tileVal;
               board[i].det = true;
            }
         }
         difficulty.innerHTML = importStr.slice(81);
         saveDifficulty = difficultyTxt.innerHTML;
         update("board");
         window.location.href = "https://min-sudoku.netlify.app/";
      }
      xhr.send();
      return true;
   } else if (encodedBoard != null && encodedBoard.length == 81) {
      let i = 0;
      for (i = 0; i < 81; i++) {
         let importVal = parseInt(encodedBoard.charAt(i));
         if (importVal >= 0 && importVal <= 9) {
            board[i].val = importVal;
            if (!validateBoard(true)) {
               return false;
            }
            if (importVal != 0) board[i].det = true;
         }
      }
      if (i == 81) {
         difficulty.innerHTML = "<b>Difficulty: </b>Custom";
         saveDifficulty = difficultyTxt.innerHTML;
         update("board");
         window.location.href = "https://min-sudoku.netlify.app/";
         return true;
      }
   }
   return false;
}

/*  UPDATES GAME IF USER HAS MADE INPUT */
function updateButtons() {
   notesButton.classList.remove("disabled");
   if (customGame) {
      notesButton.classList.add("disabled");
      if (select >= 0) {
         for (let i = 0; i < 9; i++) {
            numButtons[i].classList.remove("selected");
            numButtons[i].classList.add("disabled");
         }
         for (let i = 0; i < 9; i++) {
            if (board[select].val == i + 1) numButtons[i].classList.add("selected");
            let saveVal = board[select].val;
            board[select].val = i + 1;
            if (validateBoard(true)) numButtons[i].classList.remove("disabled");
            board[select].val = saveVal;
         }
      }
   } else if (select >= 0 && !board[select].det) {
      for (let i = 0; i < 9; i++) numButtons[i].classList.remove("disabled");
      for (let i = 0; i < 9; i++) {
         if (notes) {
            if (board[select].guesses[i]) numButtons[i].classList.add("selected");
            else numButtons[i].classList.remove("selected");
         } else {
            if (board[select].val == numButtons[i].firstChild.nodeValue) numButtons[i].classList.add("selected");
            else numButtons[i].classList.remove("selected");
         }
      }
   } else {
      for (let i = 0; i < 9; i++) {
         numButtons[i].classList.add("disabled");
         numButtons[i].classList.remove("selected");
      }
   }
}

/*  UPDATES GAME IF USER HAS MADE INPUT */
function update(text) {
   updateButtons();
   if (text == "board") {
      validateBoard(false);
      draw(false);
   } else if (text == "new-easy") {
      newGame("easy");
      draw(false);
   } else if (text == "new-medium") {
      newGame("medium");
      draw(false);
   } else if (text == "new-hard") {
      newGame("hard");
      draw(false);
   } else if (text == "start-custom-game") {
      saveBoard = makeBoardCopy(board);
      difficulty.innerHTML = "<b>Difficulty: </b>Custom";
      generateEmptyBoard();
      draw(false);
   } else if (text == "close-custom-game") {
      board = makeBoardCopy(saveBoard);
      difficultyTxt.innerHTML = saveDifficulty;
      draw(false);
   }
   if (navigator.cookieEnabled && !customGame) createCookie();
}

function main() {
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   encodedBoard = urlParams.get('board');
   customId = parseInt(urlParams.get('id'));

   generateCoords();
   generateEmptyBoard();
   let decodeSuccessful = importBoard();

   if (navigator.cookieEnabled && document.cookie != "") {
      loadCookie(decodeSuccessful);
      validateBoard(false);
   } else if (!decodeSuccessful) {
      newGame("easy");
   }

   input();
   draw(true);
}

main();