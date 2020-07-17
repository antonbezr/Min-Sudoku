<?php

$conn = mysqli_connect('us-cdbr-east-02.cleardb.com', 'b5d239a8d8033e', 'f2a52228', 'heroku_7647299d62ed093');

if(isset($_GET['var'])){

  $var = explode(",", $_GET["var"]);

  $sql = "SELECT * FROM " . mysqli_escape_string($conn, $var[0]) . " WHERE id = " . mysqli_escape_string($conn, $var[1]); 

  $result = mysqli_query($conn, $sql);

  $row = mysqli_fetch_assoc($result);

  echo($row['board']);
}



