/* TOGGLES THE NEW GAME MENU */
function toggleNewGame() {
  if (customGame) {
    document.getElementById("popup-txt").classList.toggle("hide");
    document.getElementById("done").classList.toggle("show");
    customGame = !customGame;
    update("close-custom-game");
  } else {
    document.getElementById("popup-txt").classList.toggle("hide");
    document.getElementById("new-game-difficulty").classList.toggle("show");
  }
  newGameMenu = !newGameMenu;
}

/* TURNS ON THE CUSTOM GAME DONE BUTTON */
function toggleCustom() {
  document.getElementById("new-game-difficulty").classList.toggle("show");
  document.getElementById("done").classList.toggle("show");
  customGame = !customGame;
  update("start-custom-game");
}

/* TOGGLES THE CUSTOM GAME DONE BUTTON */
function toggleDone() {
  document.getElementById("popup-txt").classList.toggle("hide");
  document.getElementById("done").classList.toggle("show");
  customGame = !customGame;
  newGameMenu = !newGameMenu;
  update();
}

/* SHOWS THE BOARD SHARE MESSAGE POPUP */
function hidePopup() {
  $("#popup-txt").removeClass("visible");
  $("#popup-txt").addClass("hidden");
}

/* HIDES THE BOARD SHARE MESSAGE POPUP */
function showPopup() {
  if (!newGameMenu) {
    $("#popup-txt").removeClass("hidden");
    $("#popup-txt").addClass("visible");
    setTimeout(function(){hidePopup();}, 500);
  }
  update("share-link");
}


/* MANAGES CLICKS MADE BY THE USER ON THE SELECTOR CANVAS */
function clickBoard(event) {
  let canvas = document.getElementById("canvas");
  let rect = canvas.getBoundingClientRect(); 
  let pos = {
    x: CANVAS_SCALE * (event.clientX - rect.left), /* (event.pageX - canvas.offsetLeft),*/
    y: CANVAS_SCALE * (event.clientY - rect.top)  /* (event.pageY - canvas.offsetTop) */
  };

  // Determine if guess clicked (tile already selected)
  let tileOffsetSize = selector.width / 9;
  if (select >= 0 && pos.x >= coords[select].x && pos.x <= (coords[select].x + tileOffsetSize)
      && pos.y >= coords[select].y && pos.y <= (coords[select].y + tileOffsetSize)) {
    for (let i = 0; i < 9; i++) {
      let tileIncrement = tileOffsetSize / 3;
      let xMin = coords[select].x + tileIncrement * (i % 3);
      let yMin = coords[select].y + tileIncrement * (Math.floor(i / 3));

      if ((pos.x >= xMin && pos.x <= xMin + tileIncrement) && (pos.y >= yMin && pos.y <= yMin + tileIncrement)) {
        tiles[select].guesses[i] = !tiles[select].guesses[i];
        i = 9;
        update("guesses");
      }
    }
  }
  else { // Determine which tile selected
    let x = Math.floor((pos.x) / tileOffsetSize);
    let y = Math.floor((pos.y) / tileOffsetSize);
    let index = x + y * 9;
    select = x + y * 9;
    update("selector");
  }
}


/* TOGGLES NOTE MODE, ENABLED BY PRESSING THE NOTES BUTTON OR (N)*/
function toggleNotes() {
  if (notes) {
    notesButton.style.backgroundColor = "var(--bg)";
    notes = false;
  }
  else {
    notesButton.style.backgroundColor = "var(--btn-out)";
    notes = true; 
  }
  update();
}


/* IF THE USER PRESSES ANY KEY ON THE KEYBOARD */
function keyPress() {
  // Close board editor if user finished creating board
  if (customGame && event.keyCode == 13) {
    toggleDone();
  }

  // E pressed (enable notes (guesses))
  if (!customGame && event.keyCode == 78) {
    toggleNotes();
  }

  if (select >= 0) {
    // Arrow key pressed (move selector)
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      if (event.keyCode == 37) { // Left
        if (select % 9 == 0) select += 8;
        else select -= 1;
      }
      else if (event.keyCode == 38) { // Up
        if (select <= 8) select += 72;
        else select -= 9;
      }
      else if (event.keyCode == 39) { // Right
        if ((select + 1) % 9 == 0) select -= 8;
        else select +=1;
      }
      else if (event.keyCode == 40) { // Down
        if (select >= 72) select -= 72;
        else select += 9;
      }
      update("selector");
    }
    else if (event.keyCode >= 49 && event.keyCode <= 57) { // Number is pressed (insert number to tile)
      if (customGame) {
        let saveVal = tiles[select].val;
        let saveDet = tiles[select].det;
        if (tiles[select].val == parseInt(event.keyCode - 48)) {
          tiles[select].val = 0;
          tiles[select].det = false;
        }
        else {
          tiles[select].val = parseInt(event.keyCode - 48);
          tiles[select].det = true;
        }
        if (!validateBoard(true, tiles)) {
          tiles[select].val = saveVal;
          tiles[select].det = saveDet;
        }
        update("board");

      }
      else if (!tiles[select].det && notes) { // Change guesses if notes is on
        tiles[select].guesses[event.keyCode - 49] = !tiles[select].guesses[event.keyCode - 49];
        update("guesses");
      }
      else if (!tiles[select].det) { // Change tiles if notes is off
        if (tiles[select].val == event.keyCode - 48) tiles[select].val = 0;
        else tiles[select].val = event.keyCode - 48;
        update("board");
      }
    }
    else if (event.keyCode == 8) { // Backspace is pressed (delete tile from board)
      if (customGame) {
        tiles[select].val = 0;
        update("board");
      }
      else if (!tiles[select].det) {
        if (notes) {
          for (let i = 0; i < 9; i++) {
            tiles[select].guesses[i] = false;
          }
          update("guesses");
        }
        else {
          tiles[select].val = 0;
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
    let saveVal = tiles[select].val;
    let saveDet = tiles[select].det;
    if (tiles[select].val == num) {
      tiles[select].val = 0;
      tiles[select].det = false;
    }
    else {
      tiles[select].val = num;
      tiles[select].det = true;
    }
    if (!validateBoard(true, tiles)) {
      tiles[select].val = saveVal;
      tiles[select].det = saveDet;
    }
    update("board");
  }
  else if (select >= 0 && !tiles[select].det) { // Normal game mode
    let numButton = document.getElementById(id);
    let num = numButton.firstChild.nodeValue;
    if (notes) {
      tiles[select].guesses[num - 1] = !tiles[select].guesses[num - 1];
      update("guesses");
    }
    else {
      if (tiles[select].val == num) tiles[select].val = 0;
      else tiles[select].val = num;
      update("board");
    }
  }
}

/* SETS UP ALL EVENT LISTENERS */
function input() {

  /* Event listeners for elements on the page */
  selector.addEventListener('click', function(event) {clickBoard(event);});
  modeButton.addEventListener('click', function() {switchTheme();});
  newGameButton.addEventListener('click', function() {toggleNewGame();});
  customButton.addEventListener('click', function() {toggleCustom();});
  doneButton.addEventListener('click', function() {toggleDone();});
  shareButton.addEventListener('click', function() {showPopup();});
  notesButton.addEventListener('click', function() {toggleNotes();});
  $(".num").on("click", function(id) {numButtonPressed($(this).attr('id'));});

  /* Turn ON/OFF features based on clicks outside elements */
  document.addEventListener('click', function(event) {

    // Turn OFF new game menu if clicked outside of it
    if (event.target != newGameButton && event.target != customButton &&
        event.target != doneButton &&
        !customGame && newGameMenu) { 
      document.getElementById("popup-txt").classList.toggle("hide");
      document.getElementById("new-game-difficulty").classList.toggle("show");
      newGameMenu = false;
    }

    // Turn off selector if clicked outside the board
    if(event.target != selector && event.target != notesButton) {
      let outsideClick = true;
      for (let i = 0; i < 9; i++) {
        if (event.target == document.getElementById("b" + i)) outsideClick = false;
      }
      if (outsideClick) {
        select = -1;
        update("selector");
      }
    }
  });

  // Keyboard listener for key values pressed by user (that aren't numbers)
  var down = false;
  document.addEventListener("keydown", function(event) {if(down) return; down = true; keyPress(event);});
  document.addEventListener('keyup', function () {down = false;});

  // Clipboard listener to override input copy
  document.addEventListener('copy', function(e) {
    e.clipboardData.setData('text/plain', link);
    e.preventDefault();
  });

}