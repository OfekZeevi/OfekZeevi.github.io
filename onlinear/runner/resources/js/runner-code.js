var loop = setInterval(checkLastMarker, 500);

var elm_lastMarker = document.querySelector("a-marker#marker-3").object3D;

var foundLastMarker = false;

var CORRECT_CODE = 71;

function checkLastMarker()
{
    if (elm_lastMarker.visible && !foundLastMarker)
    {
        foundLastMarker = true;
        
        alert("כל הכבוד! הגעתם לתחנה האחרונה!");
        var msg = "אנא הקלידו את הקוד שאספתם במהלך התחנות:";
        var input;
        while (true)
        {
            input = prompt(msg);
            if (input == CORRECT_CODE)
            {
                alert("הידד! עברתם את כל התחנות בהצלחה!");
                break;
            }
            else
            {
                alert("אופס... הקוד שנוי. נסו שוב.");
            }
        }
    }
}