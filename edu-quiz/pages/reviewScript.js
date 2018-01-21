var QUESTION_COUNT = 20;

var CORRECT_SIGN = '✓';
var INCORRECT_SIGN = '✗';

updateQuestions();

function updateQuestions()
{
    var qDiv, isCorrect;
    for (var i = 1; i <= QUESTION_COUNT; i++)
    {
        qDiv = document.querySelector("#q" + i);
        qDiv.querySelector(".qNum").innerHTML = i;
        
        isCorrect = localStorage.getItem("isCorrectQ" + i);
        qDiv.querySelector(".correct-sign").innerHTML = (isCorrect == 1 ? CORRECT_SIGN : INCORRECT_SIGN);
    }
}