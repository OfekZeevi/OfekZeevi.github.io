<?php

session_start();
if (!(isset($_SESSION['isAuth']) && $_SESSION['isAuth'] === true))
{
    header("Location: authForm.html");
    exit;
}

$scores = file_get_contents('scores.txt');

$lines = explode("\n", $scores);

$data = [];
$userNames = [];
$userEmails = [];
$userScores = [];
foreach($lines as $key => $line)
{
    if ($line != "")
    {
        $parts = explode(',', $line);
        
        $userNames[$key] = $parts[0];
        $userEmails[$key] = $parts[1];
        $userScores[$key] = $parts[2] * 1;
        
        $data[$key] = array('name' => $parts[0], 'email' => $parts[1], 'score' => $parts[2]);
    }
}

array_multisort($userScores, SORT_DESC, $userNames, SORT_ASC, $userEmails, SORT_ASC, $data);

?>

<!DOCTYPE html>

<html>

    <head>
    
        <meta charset="utf-8"/>
        
        <title>סיכום ניקוד</title>
    
        <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css" integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="style.css"/>
        
        <script type="text/javascript">
        
            /*function clearAllData()
            {
                if (confirm("האם ברצונך למחוק את כל הנתונים?"))
                {
                    if (confirm("האם אתה *בטוח* שברצונך למחוק את כל הנתונים? פעולה זו אינה הפיכה!"))
                    {
                        window.location.href = "clickTo"
                    }
                }
            }*/
            
        </script>
        
    </head>
    
    <body>
    
        <h1>סיכום ניקוד</h1>
        
        <table class="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>מקום</th>
                    <th>שם</th>
                    <th>ניקוד</th>
                    <th>כתובת אימייל</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $place = 1;
                $prev_score = -1;
                $same_as_prev;
                foreach ($data as $user)
                {
                    $same_as_prev = $user['score'] == $prev_score;
                    if (!$same_as_prev && $prev_score != -1)
                    {
                        $place++;
                    }
                    
                    echo ('<tr'.($place == 1 ? ' class="winnerRow"' : '').'>');
                        echo '<td>'.($same_as_prev ? '' : $place).'</td>';
                        echo '<td>'.$user['name'].'</td>';
                        echo '<td>'.$user['score'].'</td>';
                        echo '<td>'.$user['email'].'</td>';
                    echo '</tr>';
                    $prev_score = $user['score'];
                }
                ?>
            </tbody>
        </table>
        
        <!--<button type="button" class="pure-button" onclick="clearAllData()">מחק את כל הנתונים</button>-->
        
    </body>

</html>