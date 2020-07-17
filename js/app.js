document.getElementById('button').addEventListener('click', get);

function get(){
  var xhr = new XMLHttpRequest();
  // xhr.open('GET', 'sudoku.php?var=easy,100', true);
  xhr.open('GET', 'https://frozen-lake-90320.herokuapp.com/sudoku.php?var=easy,100', true);
  xhr.onload = function(){
  	document.getElementById('text').innerHTML = this.responseText;
  }

  xhr.send();
}