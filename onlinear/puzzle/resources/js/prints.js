var mrkrs = document.querySelectorAll("a-marker");
var mrkr1 = mrkrs[0];
var mrkr2 = mrkrs[1];

var obj1 = mrkr1.object3D;
var obj2 = mrkr2.object3D;

var loop = setInterval(loopFunc, 100);

var rot1, rot2;
var dir1;
var firstTimeInvisible = true;
function loopFunc()
{
    if (obj1.visible)// && obj2.visible)
    {
        firstTimeInvisible = true;
        rot1 = obj1.rotation;
        rot2 = obj2.rotation;
        
        dir1 = approxRotation(rot1);
        
        console.log("dir1: " + dir1 + (dir1 == -1 ? (" | rot_y_deg: " + radiansToDegrees(rot1._y)) : ""));
        /*console.log("obj1: x=" + radiansToDegrees(rot1._x) + " | y=" + radiansToDegrees(rot1._y) + " | z=" + radiansToDegrees(rot1._z));/* + "\n" +
                    "obj2: x=" + rot2._x + " | y=" + rot2._y + " | z=" + rot2._z);*/
    }
    else if (firstTimeInvisible)
    {
        console.log("NOT VISIBLE");
        firstTimeInvisible = false;
    }
}

function radiansToDegrees(rad)
{
    var deg = rad / Math.PI * 180;
    return deg;
}

function approxRotation(rot)
{
    var y = radiansToDegrees(rot._y);
    var range = (45 / 360);
    
    var degs = [0, 90, 180, -90];
    
    var dir = -1;
    for (var i = 0, len = degs.length; i < len; i++)
    {
        if (inDegRange(degs[i], range, y))
        {
            dir = i;
            break;
        }
    }
    
    return dir;
}

function inDegRange(threshold, range, val)
{
    var min = threshold - range * 360;
    var max = threshold + range * 360;
    
    var overTheEdge = false;
    if (min < -180)
    {
        min = 360 + min;
        overTheEdge = true;
    }
    
    if (max > 180)
    {
        max = max - 360;
        overTheEdge = true;
    }
    
    var minOk = (val > min);
    var maxOk = (val < max);
    
    if (overTheEdge)
    {
        return (minOk || maxOk);
    }
    else
    {
        return (minOk && maxOk);
    }
}