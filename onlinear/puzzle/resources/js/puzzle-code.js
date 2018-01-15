var mrkrs = document.querySelectorAll("a-marker");

var objs = [];
for (var i = 0, len = mrkrs.length; i < len; i++)
{
    objs[i] = mrkrs[i].object3D;
}

var CORRECT_ORDER = [
    [1, 2, 3, 4],
    [4, 1, 2, 3],
    [3, 4, 1, 2],
    [2, 3, 4, 1]
];

var loop = setInterval(loopFunc, 100);

var dir;
var firstTimeInvisible = true;
var firstTimeAlert = true;
function loopFunc()
{
    if (allVisible(objs))
    {
        firstTimeInvisible = true;
        
        dir = getDirectionIfSame(objs);
        if (dir !== false)
        {
            var order = getIndexOrderByXPos(objs);
            if (order == CORRECT_ORDER[dir])
            {
                if (firstTimeAlert)
                {
                    alert("כל הכבוד! השלמתם את פאזל " + (dir + 1) + " בהצלחה!");
                    firstTimeAlert = false;
                }
            }
            else
            {
                firstTimeAlert = true;
            }
        }
        else
        {
            firstTimeAlert = true;
        }
    }
    else if (firstTimeInvisible)
    {
        console.log("NOT ALL MARKERS VISIBLE");
        firstTimeInvisible = false;
        firstTimeAlert = true;
    }
}

function allVisible(arr)
{
    for (var i = 0, len = arr.length; i < len; i++)
    {
        if (!arr[i].visible)
        {
            return false;
        }
    }
    
    return true;
}

function getDirectionIfSame(arr)
{
    var dir = getGeneralDirection(arr[0].rotation);
    for (var i = 1, len = arr.length; i < len; i++)
    {
        if (getGeneralDirection(arr[i].rotation) != dir)
        {
            dir = -1;
            break;
        }
    }
    
    return (dir == -1 ? false : dir);
}

function getIndexOrderByXPos(arr)
{
    var len = arr.length;
    
    var order = [];
    
    var indexes = [];
    for (var i = 0; i < len; i++)
    {
        indexes.push(i);
    }
    
    var index;
    for (var i = 0; i < len; i++)
    {
        index = getMinXPosIndex(arr, indexes);
        order.push(index);
        remove(indexes, index);
    }
    
    return order;
}

function remove(array, element) 
{
    var index = array.indexOf(element);
    array.splice(index, 1);
}

function getMinXPosIndex(arr, indexes)
{
    var minVal = arr[indexes[0]].position.x;
    var minIndex = indexes[0];
    var index, val;
    for (var i = 1, len = indexes.length; i < len; i++)
    {
        index = indexes[i];
        val = arr[index].position.x;
        if (minVal > val)
        {
            minVal = val;
            minIndex = index;
        }
    }
    return minIndex;
}

function radiansToDegrees(rad)
{
    var deg = rad / Math.PI * 180;
    return deg;
}

function getGeneralDirection(rot)
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