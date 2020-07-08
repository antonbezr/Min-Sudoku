var loopCount = 0;
var nakedPairs = new Set();
var nakedTriples = new Set();

/* RETURNS A COPY OF THE BOARD */
function makeBoardCopy(board) {
  let copyTiles = [];
  for (let i = 0; i < 81; i++) {
    copyTiles.push(new Tile(board[i].val, board[i].det));
  }
  return copyTiles;
}

function eqSet(as, bs) {
  if (as.size != bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

/* UPDATE ALL POSSIBLE VALUE OPTIONS OF EACH TILE */
function updateGuesses(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i].val == 0) {
      for (let j = 0; j < 9; j++) {
        board[i].val = j + 1;
        if (validateBoard(true, board)) {
          board[i].guesses[j] = true;
        } else {
          board[i].guesses[j] = false;
        }
      }
      board[i].val = 0;
    }
  }
}

function singleCandidate(board) {
  for (let i = 0; i < 81; i++) {
    if (board[i].val == 0) {
      let guessCount = 0;
      for (let j = 0; j < 9; j++) {
        if (board[i].guesses[j]) guessCount += 1;
      }
      if (guessCount == 1) {
        for (let j = 0; j < 9; j++) {
          if (board[i].guesses[j]) {
            board[i].val = j + 1;
            return true;
          }
        }
      }
    }
  }
  return false;
}

function singlePosition(board) {
  for (let i = 0; i < 81; i++) {
    if (board[i].val == 0) {
      for (let j = 0; j < 3; j++) {
        for (let l = 0; l < 9; l++) {
          if (board[i].guesses[l]) {
            let matchingGuess = true;
            for (let k = 0; k < 81; k++) {
              if (i != k && coords[i].loc[j] == coords[k].loc[j]) {
                if (board[k].guesses[l]) {
                  matchingGuess = false;
                }
              }
            }
            if (matchingGuess) board[i].val = l + 1;
          }
        }
        if (board[i].val != 0) return true;
      }
    }
  }
  return false;
}

function nakedPair(board) {
  for (let i = 0; i < 81; i++) {
    if (board[i].val == 0) {
      for (let j = 0; j < 3; j++) {


          let guesses = new Set();
          for (let k = 0; k < 9; k++) {
            if (board[i].guesses[k]) guesses.add(k);
          }
          if (guesses.size == 2) {
            for (let k = 0; k < 81; k++) {
              let guesses2 = new Set();
              if (board[k].val == 0 && i != k && coords[i].loc[j] == coords[k].loc[j]) {
                for (let l = 0; l < 9; l++) {
                  if (board[k].guesses[l]) guesses2.add(l);
                }
              }
              if (eqSet(guesses, guesses2) && !nakedPairs.has(j + "" + i + "" + k /*+ "" + loopCount*/)) {
                nakedPairs.add(j + "" + i + "" + k /*+ "" + loopCount*/);
                for (let l = 0; l < 81; l++) {
                  if (board[l].val == 0 && l != i && l != k && coords[i].loc[j] == coords[l].loc[j]) {
                    for (let m = 0; m < 9; m++) {
                      if (board[l].guesses[m]) {
                        if (guesses.has(m)) board[l].guesses[m] = false;
                      }
                    }
                  }
                }
                //console.log("found i = " + i + " k = " + k + " x = " + j);
                return true;
              }
            }
          }
        
      }
    }
  }
  return false;
}

function nakedTriple(board) {
  for (let i = 0; i < 81; i++) {
    if (board[i].val == 0) {
      for (let j = 0; j < 3; j++) {


          let guesses = new Set();
          for (let k = 0; k < 9; k++) {
            if (board[i].guesses[k]) guesses.add(k);
          }
          if (guesses.size == 3) {
            for (let k = 0; k < 81; k++) {
              let guesses2 = new Set();
              if (board[k].val == 0 && i != k && coords[i].loc[j] == coords[k].loc[j]) {
                for (let l = 0; l < 9; l++) {
                  if (board[k].guesses[l]) guesses2.add(l);
                }
              }
              if (eqSet(guesses, guesses2)) {
                for (let l = 0; l < 81; l++) {
                  let guesses3 = new Set();
                  if (board[l].val == 0 && l != i && l != k && coords[i].loc[j] == coords[l].loc[j]) {
                    for (let m = 0; m < 9; m++) {
                      if (board[l].guesses[m]) guesses3.add(m);
                    }
                  }
                  let match = false;
                  if (guesses3.size == 3 && eqSet(guesses, guesses3)) match = true;
                  else if (guesses3.size == 2) {
                    match = true;
                    for (let g of guesses3) {
                      if (!guesses.has(g)) match = false;
                    }
                  }
                  if (match && !nakedTriples.has(j + "" + i + "" + k + "" + l /*+ "" + loopCount*/)) {
                    nakedTriples.add(j + "" + i + "" + k + "" + l /*+ "" + loopCount*/);
                    for (let m = 0; m < 81; m++) {
                      if (board[m].val == 0 && m != i && m != k && m != l && coords[i].loc[j] == coords[m].loc[j]) {
                        for (let n = 0; n < 9; n++) {
                          if (board[m].guesses[n]) {
                            if (guesses.has(n)) board[m].guesses[n] = false;
                          }
                        }
                      }
                    }
                    //console.log("found i = " + i + " k = " + k + " l = " + l + " x = " + j);
                    return true;
                  }
                }
              }
            }
          }
        
      }
    }
  }
  return false;
}


function makePuzzle() {

  let i = 0;
  while (i < 50) {
    let index = Math.floor(Math.random() * 81);
    while (tiles[index].val == 0) {
      index = Math.floor(Math.random() * 81);
    }
    let index2 = Math.abs(index - 80);
    let backup = tiles[index].val;
    tiles[index].val = 0;
    tiles[index].det = false;
    let backup2 = tiles[index2].val;
    tiles[index2].val = 0;
    tiles[index2].det = false;

    while (counter != 1) {
      tiles[index].val = backup;
      tiles[index].det = true;
      tiles[index2].val = backup2;
      tiles[index2].det = true;
      index = Math.floor(Math.random() * 81);
      while (tiles[index].val == 0) {
        index = Math.floor(Math.random() * 81);
      }
      index2 = Math.abs(index - 80);
      backup = tiles[index].val;
      backup2 = tiles[index2].val;
      tiles[index].val = 0;
      tiles[index].det = false;
      tiles[index2].val = 0;
      tiles[index2].det = false;

      let copyTiles = makeBoardCopy(tiles);

      counter = 0;
      solveBoard(copyTiles);
      console.log(counter);
    }

    i+=2;
  }

  // loopCount = 0;
  // while (!boardFull(tiles)) {
  //   loopCount += 1;
  //   updateGuesses(tiles);
  //   if (!singleCandidate(tiles)) {
  //     if (!singlePosition(tiles)) {
  //       if (!nakedPair(tiles)) {
  //         nakedPairs = new Set();
  //         if (!nakedTriple(tiles)) {
  //           nakedTriples = new Set();
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }
}

function setDeterminants() {
  for (let i = 0; i < 81; i++) {
    tiles[i].det = (!(tiles[i].val == 0));
  }
}

function puzzle() {
  makePuzzle();
  setDeterminants();
}