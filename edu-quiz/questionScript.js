var QUESTION_COUNT = 3;

function clearValidation()
{
    document.querySelector("#a1").setCustomValidity('');
}

function saveAnswer()
{
    var form = document.forms['userAnswerForm'];

    var isCorrect = form['answer'].value * 1;

    var qNum = getQNum();
    localStorage.setItem("isCorrectQ" + qNum, isCorrect);

    var nextQNum = qNum + 1;
    if (nextQNum > QUESTION_COUNT)
    {
        finishQuiz();
    }
    else
    {
        window.location.href = "q" + nextQNum + ".html";
    }
}

function getQNum()
{
    var path = window.location.pathname;
    var page = path.split("/").pop();
    var name = page.split(".")[0];
    var qNum = name.substr(1) * 1;
    return qNum;
}

function finishQuiz()
{
    var name = localStorage.getItem("userName");
    var email = localStorage.getItem("userEmail");
    var score = 0;
    var tmpScore;
    for (var i = 1; i <= QUESTION_COUNT; i++)
    {
        tmpScore = localStorage.getItem("isCorrectQ" + i);
        score += (tmpScore == null) ? 0 : (tmpScore * 1);
    }
    localStorage.setItem("finalScore", score);
    window.location.href = "score.html";
    //window.location.href = "addScore.php?name=" + name + "&email=" + email + "&score=" + score;
}