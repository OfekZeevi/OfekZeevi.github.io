<?php

if (isset($_GET['name']) && isset($_GET['email']) && isset($_GET['score']))
{
    $name = $_GET['name'];
    $email = $_GET['email'];
    $score = $_GET['score'];
    
    $file = 'scores.txt';
    $contents = file_get_contents($file);
    $contents .= "$name,$email,$score\n";
    file_put_contents($file, $contents);
    
    //echo 'Success. Current file content:<br/>'.file_get_contents($file);
    
    header("Location: success.html");
    exit;
}
else
{
    die('Missing name, email or score.');
}