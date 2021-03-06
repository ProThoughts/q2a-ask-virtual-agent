//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;
var popup_heading = "";
var va_icon_image = "";
var popup_elements = "";
var site_url ="";
//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id)
{
    for(var iii = 0; iii < popups.length; iii++)
    {
        if(id == popups[iii])
        {
            Array.remove(popups, iii);
            
            document.getElementById(id).style.display = "none";
            
            calculate_popups();
            display_virtual_agent_icon();
            return;
        }
    }
     
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
    var right = 10;
    
    var iii = 0;
    for(iii; iii < total_popups; iii++)
    {
        if(popups[iii] != undefined)
        {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }
    
    for(var jjj = iii; jjj < popups.length; jjj++)
    {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(popup_heading)
{
    var id = "ask-va-popup";
    remove_virtual_agent_icon();
    for(var iii = 0; iii < popups.length; iii++)
    {   
        //already registered. Bring it to front.
        if(id == popups[iii])
        {
            Array.remove(popups, iii);
        
            popups.unshift(id);
            
            calculate_popups();
            
            
            return;
        }
    }               
    
    //This code prepares basic chat window
    var element = '<div class="popup-box chat-popup" id="'+ id +'">';
    element = element + '<div class="popup-head">';
    element = element + '<div class="popup-head-left">'+ popup_heading +'</div>';
    element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
    element = element + '<div style="clear: both"></div></div><div class="popup-messages">';
    element = element + '<div class="popup-messages-header"></div>';
    element = element + '</div><div class="popup-messages-user-input"></div>';
    //element = element + popup_elements;
    element = element + '</div>';
    
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  

    popups.unshift(id);
    add_search_bar_to_popup();
    calculate_popups();
    
}

function display_virtual_agent_icon(){
    var element = '<div class="virtual-agent-icon">';
    element = element + '<a href="javascript:register_popup(popup_heading);">';
    element = element + '<img src="'+va_icon_image+'" />';
    element = element + '</a>';
    element = element + '</div>';
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  
}

//helps you modify the content popup message header
function change_popup_elements(popup_elements){
    document.getElementsByClassName('popup-messages-header')[0].innerHTML += popup_elements;
}

function get_popup_message_user_input(){
    return document.getElementsByClassName('popup-messages-user-input')[0];
}

function change_popup_message_user_input(html){
    get_popup_message_user_input().innerHTML += html;
}
function add_search_bar_to_popup(){
    get_popup_message_user_input().innerHTML += "<input id=\"popup-ask-box\" class=\"askbox\" type=\"text\" name=\"askbox\" />";
    bind_enter_event();
}

function add_yes_no_suggestions(){
    document.getElementById('popup-ask-box').remove();
    var html = '<p id="yes-no-suggestions" >Were these suggestions helpful? <br /> <button>Yes</button> <button onclick="click_no_suggestion_button()">No</button></p>';
    change_popup_message_user_input(html);
}

function click_no_suggestion_button(){
    document.getElementById('yes-no-suggestions').remove();

}

function bind_enter_event(){
    document.getElementById("popup-ask-box")
        .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            var html = do_search(document.getElementById("popup-ask-box").value);
            change_popup_elements(html);
            add_yes_no_suggestions();
        }
    });
}

function do_search(search_query){
    var theUrl = site_url + "qa-plugin/q2a-ask-virtual-agent/search.php?q=" + search_query;
    change_popup_elements('<p>Your search query: '+search_query+'</p>');
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function remove_virtual_agent_icon(){
    var element = document.getElementsByClassName("virtual-agent-icon")[0];
    if(element != null){
        element.remove();
    }
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
    var width = window.innerWidth;
    if(width < 540)
    {
        total_popups = 0;
    }
    else
    {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }
    
    display_popups();
    
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);