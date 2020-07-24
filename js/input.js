/* SHOWS/HIDES NEW GAME MENU */
function toggleNewGame() {
   if (customGame) {
      copy.classList.remove("hide");
      doneButton.classList.toggle("hide");
      customGame = !customGame;
      update("close-custom-game");
   } else {
      copy.classList.toggle("hide");
      copy.classList.add("hidden");
      newGameDifficulty.classList.toggle("hide");
   }
   newGameMenu = !newGameMenu;
}

/* SHOWS/HIDES COPY MENU */
function toggleCopy() {
   if (!customGame) {
      newGameDifficulty.classList.add("hide");
      copy.classList.remove("hide");
      copy.classList.toggle("hidden");
      copyTime = !copyTime;
   }
}

/* TURNS ON CUSTOM MODE & SHOWS DONE BUTTON */
function toggleCustom() {
   newGameDifficulty.classList.toggle("hide");
   doneButton.classList.toggle("hide");
   customGame = !customGame;
   update("start-custom-game");
}

/* HIDES DONE BUTTON AND FINISHES CUSTOM MODE */
function toggleDone() {
   copy.classList.remove("hide");
   doneButton.classList.toggle("hide");
   customGame = !customGame;
   newGameMenu = !newGameMenu;
   boardAltered = true;
   update();
}

/* TOGGLES NOTE MODE, ENABLED BY PRESSING THE NOTES BUTTON OR (N) */
function toggleNotes() {
   if (notes) {
      notesButton.style.backgroundColor = "var(--bg)";
      notes = false;
   } else {
      notesButton.style.backgroundColor = "var(--btn-out)";
      notes = true;
   }
   update();
}

/* IF THE USER PRESSES ANY KEY ON THE KEYBOARD */
function keyPress() {
   if (event.keyCode == 27) {
      select = -1;
      if (customGame) {
         toggleNewGame();
      } else {
         update("board");
      }
   }
   // Close board editor if user finished creating board
   if (customGame && event.keyCode == 13) toggleDone();
   if (copyTime && event.keyCode == 13) {
      copyBtn.click();
      toggleCopy();
   }
   // E pressed (enable notes (guesses))
   if (!customGame && event.keyCode == 78) toggleNotes();
   if (select >= 0) {
      // Arrow key pressed (move board)
      if (event.keyCode >= 37 && event.keyCode <= 40) {
         if (event.keyCode == 37) { // Left
            if (select % 9 == 0) select += 8;
            else select -= 1;
         } else if (event.keyCode == 38) { // Up
            if (select <= 8) select += 72;
            else select -= 9;
         } else if (event.keyCode == 39) { // Right
            if ((select + 1) % 9 == 0) select -= 8;
            else select += 1;
         } else if (event.keyCode == 40) { // Down
            if (select >= 72) select -= 72;
            else select += 9;
         }
         update("board");
      } else if (event.keyCode >= 49 && event.keyCode <= 57) { // Number is pressed (insert number to tile)
         if (customGame) {
            let saveVal = board[select].val;
            let saveDet = board[select].det;
            if (board[select].val == parseInt(event.keyCode - 48)) {
               board[select].val = 0;
               board[select].det = false;
            } else {
               board[select].val = parseInt(event.keyCode - 48);
               board[select].det = true;
            }
            if (!validateBoard(true)) {
               board[select].val = saveVal;
               board[select].det = saveDet;
            }
            update("board");
         } else if (!board[select].det && notes) { // Change guesses if notes is on
            board[select].guesses[event.keyCode - 49] = !board[select].guesses[event.keyCode - 49];
            update("board");
         } else if (!board[select].det) { // Change tiles if notes is off
            if (board[select].val == event.keyCode - 48) board[select].val = 0;
            else board[select].val = event.keyCode - 48;
            update("board");
         }
      } else if (event.keyCode == 8) { // Backspace is pressed (delete tile from board)
         if (customGame) {
            board[select].val = 0;
            update("board");
         } else if (!board[select].det) {
            if (notes) {
               for (let i = 0; i < 9; i++) {
                  board[select].guesses[i] = false;
               }
               update("board");
            } else {
               board[select].val = 0;
               update("board");
            }
         }
      }
   }
}

/* IF THE USER PRESSES A NUMBER KEY */
function numButtonPressed(id) {
   // Board custom game mode
   if (customGame && select >= 0) {
      let numButton = document.getElementById(id);
      let num = numButton.firstChild.nodeValue;
      let saveVal = board[select].val;
      let saveDet = board[select].det;
      if (board[select].val == num) {
         board[select].val = 0;
         board[select].det = false;
      } else {
         board[select].val = num;
         board[select].det = true;
      }
      if (!validateBoard(true)) {
         board[select].val = saveVal;
         board[select].det = saveDet;
      }
      update("board");
   } else if (select >= 0 && !board[select].det) { // Normal game mode
      let numButton = document.getElementById(id);
      let num = numButton.firstChild.nodeValue;
      if (notes) {
         board[select].guesses[num - 1] = !board[select].guesses[num - 1];
         update("board");
      } else {
         if (board[select].val == num) board[select].val = 0;
         else board[select].val = num;
         update("board");
      }
   }
}

/* MANAGES CLICKS MADE BY THE USER ON THE BOARD */
function clickBoard(event) {
   let rect = canvas.getBoundingClientRect();
   let pos = {
      x: CANVAS_SCALE * (event.clientX - rect.left),
      y: CANVAS_SCALE * (event.clientY - rect.top)
   };
   // Determine if guess clicked (tile already selected)
   let tileOffsetSize = canvas.width / 9;
   if (select >= 0 && pos.x >= coords[select].x && pos.x <= (coords[select].x + tileOffsetSize) &&
      pos.y >= coords[select].y && pos.y <= (coords[select].y + tileOffsetSize)) {
      for (let i = 0; i < 9; i++) {
         let tileIncrement = tileOffsetSize / 3;
         let xMin = coords[select].x + tileIncrement * (i % 3);
         let yMin = coords[select].y + tileIncrement * (Math.floor(i / 3));

         if ((pos.x >= xMin && pos.x <= xMin + tileIncrement) && (pos.y >= yMin && pos.y <= yMin + tileIncrement)) {
            board[select].guesses[i] = !board[select].guesses[i];
            i = 9;
            update("board");
         }
      }
   } else { // Determine which tile selected
      let x = Math.floor((pos.x) / tileOffsetSize);
      let y = Math.floor((pos.y) / tileOffsetSize);
      let index = x + y * 9;
      select = x + y * 9;
      update("board");
   }
}

/* SWITCHES THEME THROUGH CSS VARIABLES */
function switchTheme() {
   if (darkMode) {
      modeButton.classList.add("fas", "fa-sun");
      modeButton.classList.remove("far", "fa-moon");
      modeButton.classList.remove('dark');
      modeButton.classList.add('light');
      root.style.setProperty('--bg', 'var(--bg-l)');
      root.style.setProperty('--new-game-bkg', 'var(--new-game-bkg-l)');
      root.style.setProperty('--new-game-txt', 'var(--new-game-txt-l)');
      root.style.setProperty('--new-game-menu-txt', 'var(--new-game-menu-txt-l)');
      root.style.setProperty('--new-game-menu-bkg', 'var(--new-game-menu-bkg-l)');
      root.style.setProperty('--new-game-menu-out', 'var(--new-game-menu-out-l)');
      root.style.setProperty('--new-game-menu-hov', 'var(--new-game-menu-hov-l)');
      root.style.setProperty('--copy-bkg', 'var(--copy-bkg-l)');
      root.style.setProperty('--copy-txt', 'var(--copy-txt-l)');
      root.style.setProperty('--copy-out', 'var(--copy-out-l)');
      root.style.setProperty('--copy-hov', 'var(--copy-hov-l)');
      root.style.setProperty('--popup-bkg', 'var(--popup-bkg-l)');
      root.style.setProperty('--popup-txt', 'var(--popup-txt-l)');
      root.style.setProperty('--btn-out', 'var(--btn-out-l)');
      root.style.setProperty('--btn-hov', 'var(--btn-hov-l)');
      root.style.setProperty('--btn-txt', 'var(--btn-txt-l)');
      root.style.setProperty('--color-0', 'var(--color-0-l)');
      root.style.setProperty('--color-1', 'var(--color-1-l)');
      root.style.setProperty('--color-2', 'var(--color-2-l)');
      root.style.setProperty('--color-3', 'var(--color-3-l)');
      root.style.setProperty('--sudoku-out-tiles', 'var(--sudoku-out-tiles-l)');
      root.style.setProperty('--sudoku-out-board', 'var(--sudoku-out-board-l)');
      root.style.setProperty('--sudoku-tile-fill-0', 'var(--sudoku-tile-fill-0-l)');
      root.style.setProperty('--sudoku-tile-fill-1', 'var(--sudoku-tile-fill-1-l)');
      root.style.setProperty('--sudoku-tile-text-0', 'var(--sudoku-tile-text-0-l)');
      root.style.setProperty('--sudoku-tile-text-1', 'var(--sudoku-tile-text-1-l)');
      root.style.setProperty('--sudoku-tile-text-err', 'var(--sudoku-tile-text-err-l)');
      root.style.setProperty('--sudoku-selector', 'var(--sudoku-selector-l)');
      root.style.setProperty('--sudoku-out-guess-0', 'var(--sudoku-out-guess-0-l)');
      root.style.setProperty('--sudoku-out-guess-1', 'var(--sudoku-out-guess-1-l)');
      darkMode = false;
   } else {
      modeButton.classList.add("far", "fa-moon");
      modeButton.classList.remove("fas", "fa-sun");
      modeButton.classList.add('dark');
      modeButton.classList.remove('light');
      root.style.setProperty('--bg', 'var(--bg-d)');
      root.style.setProperty('--new-game-bkg', 'var(--new-game-bkg-d)');
      root.style.setProperty('--new-game-txt', 'var(--new-game-txt-d)');
      root.style.setProperty('--new-game-menu-txt', 'var(--new-game-menu-txt-d)');
      root.style.setProperty('--new-game-menu-bkg', 'var(--new-game-menu-bkg-d)');
      root.style.setProperty('--new-game-menu-out', 'var(--new-game-menu-out-d)');
      root.style.setProperty('--new-game-menu-hov', 'var(--new-game-menu-hov-d)');
      root.style.setProperty('--copy-bkg', 'var(--copy-bkg-d)');
      root.style.setProperty('--copy-txt', 'var(--copy-txt-d)');
      root.style.setProperty('--copy-out', 'var(--copy-out-d)');
      root.style.setProperty('--copy-hov', 'var(--copy-hov-d)');
      root.style.setProperty('--popup-bkg', 'var(--popup-bkg-d)');
      root.style.setProperty('--popup-txt', 'var(--popup-txt-d)');
      root.style.setProperty('--btn-out', 'var(--btn-out-d)');
      root.style.setProperty('--btn-hov', 'var(--btn-hov-d)');
      root.style.setProperty('--btn-txt', 'var(--btn-txt-d)');
      root.style.setProperty('--color-0', 'var(--color-0-d)');
      root.style.setProperty('--color-1', 'var(--color-1-d)');
      root.style.setProperty('--color-2', 'var(--color-2-d)');
      root.style.setProperty('--color-3', 'var(--color-3-d)');
      root.style.setProperty('--sudoku-out-tiles', 'var(--sudoku-out-tiles-d)');
      root.style.setProperty('--sudoku-out-board', 'var(--sudoku-out-board-d)');
      root.style.setProperty('--sudoku-tile-fill-0', 'var(--sudoku-tile-fill-0-d)');
      root.style.setProperty('--sudoku-tile-fill-1', 'var(--sudoku-tile-fill-1-d)');
      root.style.setProperty('--sudoku-tile-text-0', 'var(--sudoku-tile-text-0-d)');
      root.style.setProperty('--sudoku-tile-text-1', 'var(--sudoku-tile-text-1-d)');
      root.style.setProperty('--sudoku-tile-text-err', 'var(--sudoku-tile-text-err-d)');
      root.style.setProperty('--sudoku-selector', 'var(--sudoku-selector-d)');
      root.style.setProperty('--sudoku-out-guess-0', 'var(--sudoku-out-guess-0-d)');
      root.style.setProperty('--sudoku-out-guess-1', 'var(--sudoku-out-guess-1-d)');
      darkMode = true;
   }
   update("board");
}

/* HIDES DIFFERENT ELEMENTS WHEN USER CLICKS BACKGROUND */
function touchOutside(event) {
   // Turn OFF new game menu if clicked outfside of it
   if (event.target != newGameButton && event.target != customButton && event.target != doneButton
      && event.target != shareButton && event.target != copyText && event.target != copyBtn
      && ((newGameMenu && !customGame) || copyTime)) {
      console.log(1);
      copy.classList.remove("hide");
      copy.classList.add("hidden");
      newGameDifficulty.classList.add("hide");
      newGameMenu = false;
      customGame = false;
      copyTime = false;
   }
   // Turn off board if clicked outside the board
   if (event.target != canvas && event.target != notesButton) {
      let outsideClick = true;
      for (let i = 0; i < 9; i++) {
         if (event.target == document.getElementById("b" + i)) outsideClick = false;
      }
      if (outsideClick) {
         select = -1;
         update("board");
      }
   }
}

/* ENCODE TILES AS CHARACTER SEQUENCE */
function exportBoard() {
   if (boardAltered) {
      let boardStr = "";
      for (let i = 0; i < 81; i++) {
         if (board[i].det) boardStr += board[i].val;
         else boardStr += 0;
      }
      var xhr = new XMLHttpRequest();
      let url = "https://frozen-lake-90320.herokuapp.com/upload_board.php?var=" + boardStr + "," + saveDifficulty;
      xhr.open('GET', url, true);
      xhr.onload = function() {
         exportId = parseInt(this.responseText);
         copyText.setAttribute("value", "https://min-sudoku.netlify.app/?id=" + exportId);
         copyBtn.setAttribute("data-clipboard-text", "https://min-sudoku.netlify.app/?id=" + exportId);
         boardAltered = false;
         uploaded = true;
         toggleCopy();
      }
      xhr.send();
   } else {
      toggleCopy();
   }
}

/* UPDATE ALL POSSIBLE VALUE OPTIONS OF EACH TILE */
function fillGuesses() {
  for (let i = 0; i < board.length; i++) {
    if (board[i].val == 0) {
      for (let j = 0; j < 9; j++) {
        board[i].val = j + 1;
        if (validateBoard(true)) {
          board[i].guesses[j] = true;
        } else {
          board[i].guesses[j] = false;
        }
      }
      board[i].val = 0;
    }
  }
  update("board");
}

/* SETS UP ALL EVENT LISTENERS FOR THE GAME */
function input() {
   modeButton.addEventListener("click", function() {switchTheme();});
   newGameButton.addEventListener("click", function() {toggleNewGame();});
   newGameEasy.addEventListener("click", function() {update("new-easy");});
   newGameMedium.addEventListener("click", function() {update("new-medium");});
   newGameHard.addEventListener("click", function() {update("new-hard");});
   customButton.addEventListener("click", function() {toggleCustom();});
   doneButton.addEventListener("click", function() {toggleDone();});
   shareButton.addEventListener("click", function() {exportBoard();});
   canvas.addEventListener("click", function(event) {clickBoard(event);});
   for (let i = 0; i < 9; i++) {
      numButtons[i].addEventListener("click", function(id) {numButtonPressed(this.getAttribute("id"));});
   }
   notesButton.addEventListener("click", function() {toggleNotes();});
   // Turn ON/OFF features based on clicks outside elements
   document.addEventListener("click", function(event) {touchOutside(event)});
   // Keyboard listener for key values pressed by user (that aren"t numbers)
   var down = false;
   document.addEventListener("keydown", function(event) {if(down) return; down = true; keyPress(event);});
   document.addEventListener("keyup", function () {down = false;});

   difficultyTxt.addEventListener("dblclick", fillGuesses);
}