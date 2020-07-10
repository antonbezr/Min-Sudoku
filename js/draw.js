function initalizeCanvases(id) {
  var canvas = document.getElementById(id);
  var oldWidth = canvas.width;
  var oldHeight = canvas.height;
  canvas.width *= CANVAS_SCALE;
  canvas.height *= CANVAS_SCALE;
  canvas.style.width = oldWidth.toString() + "px";
  canvas.style.height = oldHeight.toString() + "px";


  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;

}

function drawGrid() {
  // Initalize canvas
  var ctx = board.getContext("2d");
  // ctx.canvas.width  = window.innerWidth;
  // ctx.canvas.height = window.innerHeight;




  let style = getComputedStyle(document.body);
  let size = board.width;
  //ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2.5;

  // Draw Sudoku tile outlines
  ctx.strokeStyle = style.getPropertyValue('--sudoku-out-tiles');;
  let tileSize = (size - 10) / 9;
  for (let i = 0; i < 9; i++) {
    for (let j=0; j < 9; j++) {
      let x = 5 + tileSize * j;
      let y = 5 + tileSize * i;
      ctx.strokeRect(x, y, tileSize, tileSize);
      let tileIndex = i * 9 + j;
      coords[tileIndex].x = x;
      coords[tileIndex].y = y;
    }
  }

  // Draw Sudoku block outlines
    ctx.strokeStyle = style.getPropertyValue('--sudoku-out-board');
  let blockSize = (size - 10) / 3;
  for (let i = 0; i < 3; i++) {
    for (let j=0; j < 3; j++) {
      ctx.strokeRect(5 + blockSize * i, 5 + blockSize * j, blockSize, blockSize);
    }
  }

  // Draw Sudoku board Outline
  ctx.strokeRect(5, 5, size - 10, size - 10);
}

function drawGuesses() {
  // Initialize canvas
  let ctx = guesses.getContext('2d');
  ctx.font = "28px Open Sans";
  let style = getComputedStyle(document.body);
  let size = guesses.width;
  let tileSize = (size - 10) / 9;
  ctx.clearRect(0, 0, size, size);

  // Draw each guess on board
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < 9; j++) {
      ctx.fillStyle = style.getPropertyValue('--sudoku-out-guess-0');
      if (tiles[i].guesses[j]) ctx.fillStyle = style.getPropertyValue('--sudoku-out-guess-1');
      let spaces = "";
      for (let k = 0; k < (j % 3 * 4); k++) {
        spaces += " ";
      }
      ctx.fillText(spaces + (j + 1), coords[i].x + 12, coords[i].y + 30 * (Math.floor(j / 3) + 1));
    }
  }
}

function drawBoard() {
  // Initialize canvas
  let ctx = board.getContext('2d');


  // ctx.canvas.width  = window.innerWidth;
  // ctx.canvas.height = window.innerHeight;

  let size = board.width;
  let tileSize = (size - 10) / 9;
  ctx.clearRect(0, 0, size, size);
  let style = getComputedStyle(document.body);
  ctx.font = "56px Open Sans";

  // Draw each tile on board
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].val > 0) {
      if (tiles[i].det) {
        ctx.fillStyle = style.getPropertyValue('--sudoku-tile-fill-1');
        ctx.fillRect(coords[i].x, coords[i].y, tileSize, tileSize);
        ctx.fillStyle = style.getPropertyValue('--sudoku-tile-text-1');;
      } else {
        ctx.fillStyle = style.getPropertyValue('--sudoku-tile-fill-0');
        ctx.fillRect(coords[i].x + 2, coords[i].y + 2, tileSize - 4, tileSize - 4);
        ctx.fillStyle = style.getPropertyValue('--sudoku-tile-text-0');;
      }
      if (tiles[i].err) ctx.fillStyle = style.getPropertyValue('--sudoku-tile-text-err');
      ctx.fillText(tiles[i].val, coords[i].x + 34, coords[i].y + 68);
    }
  }
  drawGrid();
}

function drawSelector() {
  // Initialize canvas
  let ctx = selector.getContext('2d');
  let size = selector.width;
  let tileSize = (size - 10) / 9;
  let style = getComputedStyle(document.body);

  // Clear selector canvas
  ctx.clearRect(0, 0, size, size);

  // If tile selected, draw new selector
  if (select >= 0) {
    ctx.shadowBlur = 0;
    ctx.lineWidth = 4;
    ctx.strokeStyle = style.getPropertyValue('--sudoku-selector');
    ctx.strokeRect(coords[select].x, coords[select].y, tileSize, tileSize);
    ctx.fillStyle = style.getPropertyValue('--sudoku-selector');

    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 81; i++) {
      if (i != select) {
        if (coords[select].loc[0] == coords[i].loc[0] ||
            coords[select].loc[1] == coords[i].loc[1] ) {
          ctx.fillRect(coords[i].x + 1, coords[i].y + 1, tileSize - 2, tileSize - 2);
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}

function updateButtons() {
  $("#notes").removeClass("disabled");
  if (customGame) {
    $("#notes").addClass("disabled");
    if (select >= 0) {
      $(".btn").removeClass("selected");
      $(".btn").addClass("disabled");
      for (let i = 0; i < 9; i++) {
        let numButton = document.getElementById("b" + i);
        if (tiles[select].val == i + 1) numButton.classList.add("selected");
        let saveVal = tiles[select].val;
        tiles[select].val = i + 1;
        if (validateBoard(true, tiles)) numButton.classList.remove("disabled");
        tiles[select].val = saveVal;
      }
    }
  } else if (select >= 0 && !tiles[select].det) {
    $(".btn").removeClass("disabled");
    for (let j = 0; j < 9; j++) {
      let numButton = document.getElementById("b" + j);
      if (notes) {
        if (tiles[select].guesses[j]) numButton.classList.add("selected");
        else numButton.classList.remove("selected");
      } else {
        if (tiles[select].val == numButton.firstChild.nodeValue) numButton.classList.add("selected");
        else numButton.classList.remove("selected");
      }
    }
  } else {
    $(".btn").addClass("disabled");
    for (let j = 0; j < 9; j++) {
      let numButton = document.getElementById("b" + j);
      numButton.classList.remove("selected");
    }
  }
}


function switchTheme() {
  let style = getComputedStyle(document.body);
  if (darkMode) {
    document.documentElement.style.setProperty('--bg', 'var(--bg-l)');
    document.documentElement.style.setProperty('--new-game-bkg', 'var(--new-game-bkg-l)');
    document.documentElement.style.setProperty('--new-game-txt', 'var(--new-game-txt-l)');
    document.documentElement.style.setProperty('--new-game-menu-txt', 'var(--new-game-menu-txt-l)');
    document.documentElement.style.setProperty('--new-game-menu-bkg', 'var(--new-game-menu-bkg-l)');
    document.documentElement.style.setProperty('--new-game-menu-out', 'var(--new-game-menu-out-l)');
    document.documentElement.style.setProperty('--new-game-menu-hov', 'var(--new-game-menu-hov-l)');
    document.documentElement.style.setProperty('--done-bkg', 'var(--done-bkg-l)');
    document.documentElement.style.setProperty('--done-txt', 'var(--done-txt-l)');
    document.documentElement.style.setProperty('--done-out', 'var(--done-out-l)');
    document.documentElement.style.setProperty('--done-hov', 'var(--done-hov-l)');
    document.documentElement.style.setProperty('--popup-bkg','var(--popup-bkg-l)');
    document.documentElement.style.setProperty('--popup-txt', 'var(--popup-txt-l)');
    document.documentElement.style.setProperty('--btn-out', 'var(--btn-out-l)');
    document.documentElement.style.setProperty('--btn-hov', 'var(--btn-hov-l)');
    document.documentElement.style.setProperty('--btn-txt', 'var(--btn-txt-l)');
    document.documentElement.style.setProperty('--color-0', 'var(--color-0-l)');
    document.documentElement.style.setProperty('--color-1', 'var(--color-1-l)');
    document.documentElement.style.setProperty('--color-2', 'var(--color-2-l)');
    document.documentElement.style.setProperty('--color-3', 'var(--color-3-l)');
    document.documentElement.style.setProperty('--sudoku-out-tiles', 'var(--sudoku-out-tiles-l)');
    document.documentElement.style.setProperty('--sudoku-out-board', 'var(--sudoku-out-board-l)');
    document.documentElement.style.setProperty('--sudoku-tile-fill-0', 'var(--sudoku-tile-fill-0-l)');
    document.documentElement.style.setProperty('--sudoku-tile-fill-1', 'var(--sudoku-tile-fill-1-l)');
    document.documentElement.style.setProperty('--sudoku-tile-text-0', 'var(--sudoku-tile-text-0-l)');
    document.documentElement.style.setProperty('--sudoku-tile-text-1', 'var(--sudoku-tile-text-1-l)');
    document.documentElement.style.setProperty('--sudoku-tile-text-err', 'var(--sudoku-tile-text-err-l)');
    document.documentElement.style.setProperty('--sudoku-selector', 'var(--sudoku-selector-l)');
    document.documentElement.style.setProperty('--sudoku-out-guess-0', 'var(--sudoku-out-guess-0-l)');
    document.documentElement.style.setProperty('--sudoku-out-guess-1', 'var(--sudoku-out-guess-1-l)');
    drawGrid();
    drawGuesses();
    drawBoard();
    darkMode = false;
  } else {
    document.documentElement.style.setProperty('--bg', 'var(--bg-d)');
    document.documentElement.style.setProperty('--new-game-bkg', 'var(--new-game-bkg-d)');
    document.documentElement.style.setProperty('--new-game-txt', 'var(--new-game-txt-d)');
    document.documentElement.style.setProperty('--new-game-menu-txt', 'var(--new-game-menu-txt-d)');
    document.documentElement.style.setProperty('--new-game-menu-bkg', 'var(--new-game-menu-bkg-d)');
    document.documentElement.style.setProperty('--new-game-menu-out', 'var(--new-game-menu-out-d)');
    document.documentElement.style.setProperty('--new-game-menu-hov', 'var(--new-game-menu-hov-d)');
    document.documentElement.style.setProperty('--done-bkg', 'var(--done-bkg-d)');
    document.documentElement.style.setProperty('--done-txt', 'var(--done-txt-d)');
    document.documentElement.style.setProperty('--done-out', 'var(--done-out-d)');
    document.documentElement.style.setProperty('--done-hov', 'var(--done-hov-d)');
    document.documentElement.style.setProperty('--popup-bkg','var(--popup-bkg-d)');
    document.documentElement.style.setProperty('--popup-txt', 'var(--popup-txt-d)');
    document.documentElement.style.setProperty('--btn-out', 'var(--btn-out-d)');
    document.documentElement.style.setProperty('--btn-hov', 'var(--btn-hov-d)');
    document.documentElement.style.setProperty('--btn-txt', 'var(--btn-txt-d)');
    document.documentElement.style.setProperty('--color-0', 'var(--color-0-d)');
    document.documentElement.style.setProperty('--color-1', 'var(--color-1-d)');
    document.documentElement.style.setProperty('--color-2', 'var(--color-2-d)');
    document.documentElement.style.setProperty('--color-3', 'var(--color-3-d)');
    document.documentElement.style.setProperty('--sudoku-out-tiles', 'var(--sudoku-out-tiles-d)');
    document.documentElement.style.setProperty('--sudoku-out-board', 'var(--sudoku-out-board-d)');
    document.documentElement.style.setProperty('--sudoku-tile-fill-0', 'var(--sudoku-tile-fill-0-d)');
    document.documentElement.style.setProperty('--sudoku-tile-fill-1', 'var(--sudoku-tile-fill-1-d)');
    document.documentElement.style.setProperty('--sudoku-tile-text-0', 'var(--sudoku-tile-text-0-d)');
    document.documentElement.style.setProperty('--sudoku-tile-text-1', 'var(--sudoku-tile-text-1-d)');
    document.documentElement.style.setProperty('--sudoku-tile-text-err', 'var(--sudoku-tile-text-err-d)');
    document.documentElement.style.setProperty('--sudoku-selector', 'var(--sudoku-selector-d)');
    document.documentElement.style.setProperty('--sudoku-out-guess-0', 'var(--sudoku-out-guess-0-d)');
    document.documentElement.style.setProperty('--sudoku-out-guess-1', 'var(--sudoku-out-guess-1-d)');
    drawGrid();
    drawGuesses();
    drawBoard();
    darkMode = true;
  }
}

function draw() {
  // initalizeCanvases("guesses");
  initalizeCanvases("board");
  // initalizeCanvases("selector");
  drawGrid();
  // document.fonts.load('12pt "Open Sans"').then(drawGuesses);
  document.fonts.load('12pt "Open Sans"').then(drawBoard);
}