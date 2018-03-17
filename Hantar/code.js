var LS_PREFIX = "hantar_";
var LS_KEY_SESSION_ID = LS_PREFIX + "session_id";
var LS_KEY_LIST_SIGNATURE = LS_PREFIX + "list_signature";

var LIST_SIGNATURE_REGEX = /^(?:(?:^|,)(\d+(-\d+)?))+$/g

function log(str) { console.log(str); }

function range(start, end, step=1)
{
    var list = []
    var max = Math.max(start, end);
    var min = Math.min(start, end);
    for (var i = min; i <= max; i += step)
    {
        list.push(i);
    }
    return list;
}

function sort(arr, remove_dups=false)
{
    arr.sort(function(a, b) { return (a - b); });
    
    if (remove_dups)
    {
        arr = arr.filter(function(item, index) { return arr.indexOf(item) == index });
    }
    
    return arr;
}

function gen_num_list(list_signature)
{
    var list = [];
    var items = list_signature.split(",");
    var range_parts;
    for (var i = 0, len = items.length; i < len; i++)
    {
        if (items[i].indexOf("-") == -1)
        {
            list.push(items[i] * 1);
        }
        else
        {
            range_parts = items[i].split("-");
            list = list.concat(range(range_parts[0] * 1, range_parts[1] * 1));
        }
    }
    return list;
}

function gen_list_signature(num_list)
{
    var item = num_list[0];
    var prev_item;
    var list_signature = num_list[0];
    var range_count = 1;
    for (var i = 1, len = num_list.length; i < len; i++)
    {
        prev_item = item;
        item = num_list[i];
        if (item == prev_item + 1)
        {
            range_count++;
            if (i == len - 1)
            {
                list_signature += "-" + item;
            }
        }
        else
        {
            if (range_count > 1)
            {
                list_signature += "-" + prev_item;
            }
            list_signature += "," + item;
            range_count = 1;
        }
    }
    return list_signature;
}

function prev_session_exists()
{
    return localStorage.getItem(LS_KEY_SESSION_ID) != null
}

function get_session_id()
{
    return localStorage.getItem(LS_KEY_SESSION_ID);
}

function cont_prev_session()
{
    log("CONTINUE PREVIOUS SESSION - Checking previous session...");
    if (prev_session_exists())
    {
        log("Connecting to previous session (" + get_session_id() + ")...");
    }
    else
    {
        log("No previous session.");
        alert("There is no existing session!");
    }
}

function new_session()
{
    log("CREATE NEW SESSION - Checking previous session...");
    if (!prev_session_exists() || confirm("Are you sure? This will delete all previous data!"))
    {
        log("Starting new session...");
        var session_id = new Date().getTime();
        localStorage.setItem(LS_KEY_SESSION_ID, session_id);
        log("New session id: " + session_id);
    }
    else
    {
        log("Operation canceled by user.");
    }
}