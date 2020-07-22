/* UPDATES COORDINATES TO DRAW ELEMENTS */
function updateCoords() {
   let size = canvas.width;
   let offset = size / 190;
   let tileSize = (size - offset * 2) / 9;
   for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
         let x = offset + tileSize * j;
         let y = offset + tileSize * i;
         let tileIndex = i * 9 + j;
         coords[tileIndex].x = x;
         coords[tileIndex].y = y;
      }
   }
}

/* DRAWS ALL GUESSES FOR TILES NOT FILLED IN */
function drawGuesses() {
   // Initialize canvas
   let ctx = canvas.getContext('2d');
   let style = getComputedStyle(document.body);
   let size = canvas.width;
   let offset = size / 190;
   let tileSize = (size - 10) / 9;
   ctx.font = (size / 31.5) + "px Open Sans";
   // Draw each guess on board
   for (let i = 0; i < 81; i++) {
      if (board[i].val == 0) {
         for (let j = 0; j < 9; j++) {
            ctx.fillStyle = style.getPropertyValue('--sudoku-out-guess-0');
            if (board[i].guesses[j]) ctx.fillStyle = style.getPropertyValue('--sudoku-out-guess-1');
            let spaces = "";
            for (let k = 0; k < (j % 3 * 4); k++) {
               spaces += " ";
            }
            ctx.fillText(spaces + (j + 1), coords[i].x + size / 79, coords[i].y + size / 31.6 * (Math.floor(j / 3) + 1) + size / 350);
         }
      }
   }
}

/* DRAWS ALL TILES THAT ARE FILLED IN */
function drawBoard() {
   // Initialize canvas
   let ctx = canvas.getContext('2d');
   let size = canvas.width;
   let offset = size / 190;
   let offset2 = size / 475;
   let tileSize = (size - offset * 2) / 9;
   let fontSize = size / 16.9;
   ctx.font = fontSize + "px Open Sans";
   // Draw each tile on board
   for (let i = 0; i < 81; i++) {
      if (board[i].val > 0) {
         if (board[i].det) {
            ctx.fillStyle = style.getPropertyValue('--sudoku-tile-fill-1');
            ctx.fillRect(coords[i].x, coords[i].y, tileSize, tileSize);
            ctx.fillStyle = style.getPropertyValue('--sudoku-tile-text-1');;
         } else {
            ctx.fillStyle = style.getPropertyValue('--sudoku-tile-fill-0');
            ctx.fillRect(coords[i].x + offset2, coords[i].y + offset2, tileSize - offset2 * 2, tileSize - offset2 * 2);
            ctx.fillStyle = style.getPropertyValue('--sudoku-tile-text-0');;
         }
         if (board[i].err) ctx.fillStyle = style.getPropertyValue('--sudoku-tile-text-err');
         let xOffset = size / 26.33;
         let yOffset = size / 13.16;
         ctx.fillText(board[i].val, coords[i].x + xOffset, coords[i].y + yOffset);
      }
   }
}

/* DRAWS SUDOKU OUTLINE GRID */
function drawGrid() {
   // Initalize canvas
   let ctx = canvas.getContext("2d");
   let size = canvas.width;
   ctx.beginPath();
   ctx.lineWidth = size / 380;
   let offset = size / 190;
   // Draw Sudoku tile outlines
   ctx.strokeStyle = style.getPropertyValue('--sudoku-out-tiles');;
   let tileSize = (size - offset * 2) / 9;
   for (let i = 0; i < 81; i++) {
      ctx.strokeRect(coords[i].x, coords[i].y, tileSize, tileSize);
   }
   // Draw Sudoku block outlines
   ctx.strokeStyle = style.getPropertyValue('--sudoku-out-board');
   let blockSize = (size - offset * 2) / 3;
   for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         ctx.strokeRect(offset + blockSize * i, offset + blockSize * j, blockSize, blockSize);
      }
   }
   // Draw Sudoku board Outline
   ctx.strokeRect(offset, offset, size - offset * 2, size - offset * 2);
}

/* DRAWS SELECTOR IF USER CLICKS ON BOARD AND SELECTS TILE */
function drawSelector() {
   // Initialize canvas
   let ctx = canvas.getContext('2d');
   let size = canvas.width;
   let offset = size / 190;
   let offset2 = size / 948;
   let tileSize = (size - offset * 2) / 9;
   // If tile selected, draw new selector
   if (select >= 0) {
      ctx.lineWidth = size / 237.5;
      ctx.strokeStyle = style.getPropertyValue('--sudoku-selector');
      ctx.strokeRect(coords[select].x, coords[select].y, tileSize, tileSize);
      ctx.fillStyle = style.getPropertyValue('--sudoku-selector');
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 81; i++) {
         if (i != select) {
            if (coords[select].loc[0] == coords[i].loc[0] ||
               coords[select].loc[1] == coords[i].loc[1]) {
               ctx.fillRect(coords[i].x + offset2 / 2, coords[i].y + offset2 / 2, tileSize - offset2, tileSize - offset2);
            }
         }
      }
      ctx.globalAlpha = 1;
   }
}

/* RESIZES CANVAS AND DRAWS ALL ELEMENTS */
function draw(initialize) {
   if (initialize) {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let size = 0;
      if (width > height * 0.68) {
         size = height * 0.68;
      } else {
         size = width * 0.95;
      }
      strSize = size + "px";
      canvas.style.width = strSize;
      canvas.style.height = strSize;
      canvas.width = size;
      canvas.height = size;
      root.style.setProperty('--size', strSize);

      let oldWidth = canvas.width;
      let oldHeight = canvas.height;
      canvas.width *= CANVAS_SCALE;
      canvas.height *= CANVAS_SCALE;
      canvas.style.width = oldWidth.toString() + "px";
      canvas.style.height = oldHeight.toString() + "px";
   }
   let ctx = canvas.getContext("2d");
   size = canvas.width;
   ctx.fillStyle = style.getPropertyValue('--bg');
   ctx.fillRect(0, 0, size, size);
   updateCoords();
   document.fonts.load('12pt "Open Sans"').then(drawGuesses);
   document.fonts.load('12pt "Open Sans"').then(drawBoard);
   document.fonts.load('12pt "Open Sans"').then(drawGrid);
   document.fonts.load('12pt "Open Sans"').then(drawSelector);
}