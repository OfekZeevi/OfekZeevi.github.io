<?php

if (isset($_POST['password']))
{
    $password = $_POST['password'];
    $correct_password = 'Yekevitkin';
    
    if ($password == $correct_password)
    {
        session_start();
        $_SESSION['isAuth'] = true;
        header("Location: showAllScores.php");
        exit;
    }
}