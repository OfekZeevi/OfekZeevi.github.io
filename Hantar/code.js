var LS_PREFIX = "hantar_";
var LS_KEY_SESSION_ID = LS_PREFIX + "session_id";
var LS_KEY_UNMARKED_LIST = LS_PREFIX + "unmarked_list";
var LS_KEY_MARKED_LIST = LS_PREFIX + "marked_list";

var LIST_SIGNATURE_REGEX = /^(?:(?:^|,)(\d+(-\d+)?))+$/g;

var ELM_ID_LISTS = ["unmarked-list", "marked-list"];

var ELM_ID_MAIN_MENU = "main-menu";
var ELM_ID_MAIN_SCREEN = "main-screen";

var ELM_ID_INPUT = "num-input";
var ELM_ID_MARK_BTN = "mark-btn";

var ELM_ID_QUICK_FIX_CHKBX = "allow-click-chkbx";

var LIST_ITEM_TAG = "li";

var MARK_BTN_ONCLICK_SINGLE = "mark_num(this.previousElementSibling.value);this.previousElementSibling.value=''"
var MARK_BTN_ONCLICK_MULTIPLE = "mark_nums(this.previousElementSibling.value);this.previousElementSibling.value=''"

var INPUT_TYPE_MODE_SINGLE = "tel";
var INPUT_TYPE_MODE_MULTIPLE = "text";

var INPUT_MODE_SWITCH = {
    "single": {"type": INPUT_TYPE_MODE_SINGLE, "onclick": MARK_BTN_ONCLICK_SINGLE},
    "multiple": {"type": INPUT_TYPE_MODE_MULTIPLE, "onclick": MARK_BTN_ONCLICK_MULTIPLE}
};

init();

function log(str) { console.log(str); }

function load(key)
{
    return localStorage.getItem(key);
}

function save(key, value)
{
    localStorage.setItem(key, value);
}

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
    if (list_signature == "")
    {
        return [];
    }
    
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
    if (num_list.length == 0)
    {
        return "";
    }
    
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

function save_num_lists(num_lists)
{
    save(LS_KEY_UNMARKED_LIST, gen_list_signature(num_lists[0]));
    save(LS_KEY_MARKED_LIST, gen_list_signature(num_lists[1]));
}

function prev_session_exists()
{
    return load(LS_KEY_SESSION_ID) != null
}

function get_session_id()
{
    return load(LS_KEY_SESSION_ID);
}

function get_session_num_lists()
{
    return [
        gen_num_list(load(LS_KEY_UNMARKED_LIST)),
        gen_num_list(load(LS_KEY_MARKED_LIST))
    ];
}

function add_items_to_lists(elm_list, data_lists)
{
    var node;
    for (var i = 0; i < elm_list.length; i++)
    {
        for (var j = 0; j < data_lists[i].length; j++)
        {
            node = document.createElement("li");
            node.setAttribute("value", data_lists[i][j]);
            node.innerHTML = data_lists[i][j];
            elm_list[i].appendChild(node);
        }
    }
}

function get_list_elms()
{
    elm_lists = [];
    for (var i = 0, len = ELM_ID_LISTS.length; i < len; i++)
    {
        elm_lists.push(document.querySelector("#" + ELM_ID_LISTS[i]));
    }
    return elm_lists;
}

function cont_prev_session()
{
    log("CONTINUE PREVIOUS SESSION - Checking previous session...");
    if (prev_session_exists())
    {
        log("Connecting to previous session (" + get_session_id() + ")...");
        init_main_screen();
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
        save(LS_KEY_SESSION_ID, session_id);
        log("New session id: " + session_id);
        var sig;
        do
        {
            sig = prompt("Please enter a valid number list:");
        } while (!sig.match(LIST_SIGNATURE_REGEX))
        save(LS_KEY_UNMARKED_LIST, sig);
        save(LS_KEY_MARKED_LIST, "");
        init_main_screen();
    }
    else
    {
        log("Operation canceled by user.");
    }
}

function remove_all_children(elm)
{
    while (elm.lastChild)
    {
        elm.removeChild(elm.lastChild);
    }
}

function remove_all_children_arr(arr)
{
    for (var i = 0, len = arr.length; i < len; i++)
    {
        remove_all_children(arr[i]);
    }
}

function init_main_screen()
{
    list_elms = get_list_elms();
    session_lists = get_session_num_lists();
    
    remove_all_children_arr(list_elms);
    add_items_to_lists(list_elms, session_lists);
    
    show_screen(ELM_ID_MAIN_SCREEN);
}

function get_elm_by_value(tag, val)
{
    return document.querySelector(tag + "[value='" + val + "']");
}

function add_child_sorted(list, elm)
{
    var items = list.childNodes;
    var len = items.length;
    var i = 0;
    while (i < items.length && items[i].value < elm.value)
    {
        i++;
    }
    
    if (i == len)
    {
        list.appendChild(elm);
    }
    else
    {
        list.insertBefore(elm, items[i]);
    }
}

function contains(arr, item)
{
    for (var i = 0, len = arr.length; i < len; i++)
    {
        if (arr[i] == item)
        {
            return true;
        }
    }
    
    return false;
}

function move_child_node(lists, elm, from, to)
{
    if (contains(lists[from].childNodes, elm))
    {
        lists[from].removeChild(elm);
        
        if (!contains(lists[to].childNodes, elm))
        {
            add_child_sorted(lists[to], elm);
        }
    }
}

function move_item(num, from, to)
{
    item = get_elm_by_value(LIST_ITEM_TAG, num);
    if (item != null)
    {
        move_child_node(get_list_elms(), item, from, to);
        
        var num_lists = get_session_num_lists();
        var item_from_index = num_lists[from].indexOf(num);
        if (item_from_index != -1)
        {
            num_lists[from].splice(item_from_index, 1);
        }
        num_lists[to].push(num);
        num_lists[to] = sort(num_lists[to], true);
        save_num_lists(num_lists);
    }
}

function allow_quick_edits()
{
    return document.querySelector("#" + ELM_ID_QUICK_FIX_CHKBX).checked;
}

function mark_num(num, is_quick_fix=false)
{
    if (is_quick_fix && !allow_quick_edits())
    {
        return;
    }
    
    log("Marking num " + num);
    move_item(num * 1, 0, 1);
}

function mark_nums(nums)
{
    if (nums.match(LIST_SIGNATURE_REGEX))
    {
        log("Marking nums " + nums);
        num_list = gen_num_list(nums);
        for (var i = 0, len = num_list.length; i < len; i++)
        {
            mark_num(num_list[i]);
        }
    }
    else
    {
        alert("Invalid list syntax!");
    }
}

function unmark_num(num, is_quick_fix=false)
{
    if (is_quick_fix && !allow_quick_edits())
    {
        return;
    }
    
    log("Unmarking num " + num);
    move_item(num, 1, 0);
}

function set_input_mode(mode)
{
    document.querySelector("#" + ELM_ID_INPUT).setAttribute("type", INPUT_MODE_SWITCH[mode]["type"]);
    document.querySelector("#" + ELM_ID_MARK_BTN).setAttribute("onclick", INPUT_MODE_SWITCH[mode]["onclick"]);
    log("Set input mode to " + mode);
}

/* MANAGE SCREENS */

function init()
{
    if (prev_session_exists())
    {
        show_screen(ELM_ID_MAIN_SCREEN);
        cont_prev_session();
    }
    else
    {
        new_session();
    }
}

function show_screen(screen_id)
{
    screens = document.querySelectorAll(".screen");
    screen = document.querySelector("#" + screen_id);
    for (var i = 0, len = screens.length; i < len; i++)
    {
        if (screens[i] != screen)
        {
            screens[i].style.display = "none";
        }
    }
    screen.style.display = "block";
}

/* WHATSAPP SHARING */

function share_to_whatsapp()
{
    var list_str = get_session_num_lists()[0].join("\\n");
    var msg = "המספרים+הבאים+עדיין+לא+הודיעו+לי:\\n" + list_str;
    var link = "whatsapp://send?text=" + msg;
    window.open(link);
}