//Variables
var vars={
    client_id:"",
    client_secret:"",
    apiURL:"http://api.cel.ly/api",
    cellyImagesFolder:"http://cdn-a.cel.ly/celly/images/avatars/",
    logoutURL:"http://cel.ly/logout",
    redirectURL:"",
    domain:"",
    QueryString:{},
    dropDown:"",
    accTok:null,
    accTokCookie:"access_token",
    ie:false,
    myResponse:"",
    me:{}
}

//variables REQUIRED by cellyAPI
vars.client_id="afdc8877-80c0-4256-9f5c-a8e90775b325";
vars.client_secret="18901231-bc27-4ad0-a77c-29a7d62ca00a";
vars.domain=".guimelsa.com"; //This variable is for setting the cookie to the current domain
vars.redirectURL=""; //This can be modified here if it is a fixed URL


//local variables
vars.postURL="http://guimelsa.com/celly/bookmarklet/post/";
vars.maxLengthMessage=450;

//Selectors:
vars.textArea="#post_textarea";
vars.dropDown="#cellDropDown";
vars.postButton="#post_button";
vars.closeButton="#close_button";
vars.successAlert="#success_alert";
vars.failureAlert="#failure_alert";
vars.about_bookmarklet="#about_bookmarklet";
vars.about_bookmarklet_modal="#about_bookmarklet_modal";
vars.topBar='nav.top-bar';
vars.logout="#logout";
vars.usrName="#usrName";
vars.usrLogo="#usrLogo";
vars.charsLeft="#charsLeft";
//Messages
vars.messageText="Hey, check out this website: ";
vars.successMessage="Post Successful";
vars.loggedOut="Logged out successfully";
vars.unexpectedError="The website encountered an unexpected error. Please try again later.";
vars.noCellsSelected ="You must select at least one cell.";
vars.BMalert="To use this bookmarklet, please drag me into your bookmarks bar and click me there!\n\nThanks!";
