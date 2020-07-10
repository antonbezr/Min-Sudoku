const CANVAS_SCALE = 2;

const guesses = document.getElementById("guesses");
const board = document.getElementById("board");
const selector = document.getElementById("selector");

const modeButton = document.getElementById("mode")
const newGameButton = document.getElementById("new-game");
const customButton = document.getElementById("custom");
const doneButton = document.getElementById("done");
const shareButton = document.getElementById("share-board");
const notesButton = document.getElementById("notes");

var encodedTiles = "";
var tiles = [];
var coords = [];

var darkMode = true;
var link = "";
var newGameMenu = false;
var customGame = false;
var saveTiles = [];
var done = false;

var select = -1;
var notes = false;
var counter = 0;

class Tile {
  constructor(val, det) {
    this.val = val;
    this.det = det;
    this.guesses = [false, false, false,
                    false, false, false,
                    false, false, false];
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

/* SHUFFLES ARRAY */
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
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
  tiles = [];
  for (let i = 0; i < 81; i++) {
    tiles.push(new Tile(0, false));
  }
}

/* GENERATES FILLED IN SUDOKU BOARD */
function generateNumbers(index) {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].val == 0) {
      let numArr = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
      for (let j = 0; j < numArr.length; j++) {
        tiles[i].val = numArr[j];
        if (validateBoard(true, tiles)) {
          if (boardFull(tiles)) return true;
          else if (generateNumbers(i)) return true;
        }
        else {
          tiles[i].val = 0;
        }
      }
      break;
    } 
  }
  tiles[index].val = 0;
}

/* CHECKS IF SUDOKU BOARD IS FULL */
function boardFull(board) {
  for (let i = 0; i < 81; i++) if (board[i].val == 0) return false;
  return true;
}

/* VALIDATES SUDOKU BOARD */
function validateBoard(setErrorsRed, board) {
  let seen = new Set();
  // Valdates board
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let index = i * 9 + j;
      let val = board[index].val;
      let valStr = "(" + val + ")";
      if (!setErrorsRed) board[index].err = false;

      if (val > 0) {
        let row = valStr + i;
        let col = j + valStr;
        let sqr = Math.floor(i / 3) + valStr + Math.floor(j / 3);

        if (setErrorsRed) {
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
  if (setErrorsRed) return true;
  // Set error values to each tile if necessary
  else {
    for (let i = 0; i < 81; i++) {
      for (let j = 0; j < 81; j++) {
        if (board[i].val > 0 && i != j && board[i].val == board[j].val) {
          if (coords[i].loc[0] == coords[j].loc[0] ||
              coords[i].loc[1] == coords[j].loc[1] ||
              coords[i].loc[2] == coords[j].loc[2] ) {
              board[i].err = true;
          }
        }
      }
    }
  }
}

/* SOLVES SUDOKU BOARD */
function solveBoard(board) {
  let i = 0;
  for (let i = 0; i < 81; i++) {
    if (board[i].val == 0) {
      for (let j = 1; j < 10; j++) {
        board[i].val = j;
        if (validateBoard(true, board)) {
          if (boardFull(board)) {
            counter += 1;
            return true;
          } else if (solveBoard(board)) {
            return true;
          }
        } else {
          board[i].val = 0;
        }
      }
      break;
    }
  }
}

/* ENCODE TILES AS CHARACTER SEQUENCE */
function encodeTiles() {
  link = "https://min-sudoku.herokuapp.com/?board=";
  for (let i = 0; i < 81; i++) {
    if (tiles[i].det) link += tiles[i].val;
    else link += 0;
  }
  var copyText = document.getElementById("link");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

/* LOADS ENCODED TILES */
function decodeTiles() {
  let i = 0;
  if (encodedTiles != null && encodedTiles.length == 81) {
    for (i = 0; i < 81; i++) {
      let importVal = parseInt(encodedTiles.charAt(i));
      if (importVal >= 0 && importVal <= 9) {
        tiles[i].val = importVal;
        if (!validateBoard(true, tiles)) {
          return false;
        }
        if (importVal != 0) tiles[i].det = true;
      }
    }
  }
  if (i == 81) return true;
  return false;
}


/* CACHE TILES (BOARD) */
function createCookie() {
  let tilesString = "";
  for (let i = 0; i < 81; i++) {
    tilesString += tiles[i].val;
    tilesString += tiles[i].det;
    for (let j = 0; j < 9; j++) {
      tilesString +=tiles[i].guesses[j];
    }
    tilesString += tiles[i].err;
  }
  document.cookie = "tiles=" + tilesString;
}


/*  UPDATES GAME IF USER HAS MADE INPUT */
function update(text) {
  updateButtons();
  if (text == "selector") {
    drawSelector();
  }
  else if (text == "board") {
    validateBoard(false, tiles);
    drawBoard();
  }
  else if (text == "guesses") {
    drawGuesses();
  }
  else if (text == "start-custom-game") {
    saveTiles = makeBoardCopy(tiles);
    generateEmptyBoard();
    drawBoard();
  }
  else if (text == "close-custom-game") {
    tiles = makeBoardCopy(saveTiles);
    validateBoard(false, tiles);
    drawBoard();
  }
  else if (text == "share-link") {
    encodeTiles();
  }
}

function main() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  encodedTiles = urlParams.get('board');

  generateCoords();
  generateEmptyBoard();
  let decodeSuccessful = decodeTiles();
  if (!decodeSuccessful) {
    generateEmptyBoard();
    generateNumbers();
    puzzle();
  }
  validateBoard(false, tiles);

  document.cookie = "board=5;";
  // createCookie();
  var x = document.cookie;
  console.log(document.cookie.split(";"));

  // input();
  draw();
}

main();