<?php
$db = ""; # Fill in your own
$host = "";
$usr = "";
$pwd = "";

# connect to database
$cid = mysqli_connect($host, $usr, $pwd, $db);

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
