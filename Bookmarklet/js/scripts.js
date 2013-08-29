if(vars.QueryString.url) vars.QueryString.url=decodeURIComponent(vars.QueryString.url);

//This variable requires the QueryString object, which is loaded after the load of cellyAPI.js
vars.redirectURL=vars.postURL+"?url="+encodeURIComponent(vars.QueryString.url);

//Extended functions from cellyAPI
/*
* Function: populateCells
* Arguments: NONE
* Task: Add list of cells to the dropdown, adds the avatar
* and username from /me
*/
funcs.populateCells=function(){
    for(var i=0;i<vars.me.cells.length;i++){
        $(vars.dropDown).append($("<option></option>").attr("value",vars.me.cells[i].entityId).text(vars.me.cells[i].name));
    }
    $('.chzn-select').chosen({width: "100%"});
    if(vars.me.hasAvatar && vars.me.avatar) $(vars.usrLogo).append($("<img>").attr('src',vars.cellyImagesFolder+vars.me.avatar+".png"));
    if(vars.me.userName) $(vars.usrName).html("@"+vars.me.userName);
};

/*
* Function: onError
* Arguments:
* status - type of error from API Server
* error - description of the error
* Task: Overwrite onError function to display the errors to
* the user
*/
funcs.onError=function(xhr, status, error){
    $(vars.failureAlert).foundation('reveal', 'open');
    $(vars.failureAlert+" label").html("Error"+(status!=""?" ":"")+status+": "+error);
}

/* Function: success
* Arguments:
* message - displays the response from API server
* action - closeWindow()
* wait - time to close the window
* Task: Display success 'message' and close the window 
* (or executes action) after 5 seconds or after clicking in 'x'
*/
funcs.success=function(message,action,wait){
    $(vars.successAlert).foundation('reveal', 'open');
    action=action||function(){window.close()};
    wait=wait||5000;
    $(vars.successAlert+" label").html(message);
    $(vars.successAlert+" a").click(action);
    window.setTimeout(action,wait);
}

// If browser is Internet Explorer then wait until document is ready to make requests to the API
if(!vars.ie) funcs.init(funcs.populateCells);

$(document).ready(function(){
        if(vars.ie) funcs.init(funcs.populateCells);
        // Set default text in textarea using the 'url' in 'QueryString'
        $(vars.textArea).val(vars.messageText + vars.QueryString.url);
        $(vars.charsLeft).val(vars.maxLengthMessage-(vars.messageText + vars.QueryString.url).length);
        // Listen to click on post button
        $(vars.postButton).click(function(){
                // post message for each cell selected
                if($('.chzn-select :selected').length==0) funcs.onError({},'',vars.noCellsSelected)
                $.each($('.chzn-select').val(),function(key,value){
                        var data={"oauth_token" : vars.accTok,"message" : {"body" : $(vars.textArea).val(),"cellId" : value}}
                        funcs.requestAPI('json','/messages',data,function(response){
                                //TODO: verify that each request was done successful, and then call just one time either to the success or onError function
                                //Verify that response is correct, otherwise there was an error
                                if(response.stat && response.stat=="OK" && response.response.time){
                                    funcs.success(vars.successMessage);
                                } else if(response.error && response.description) {
                                    funcs.onError({},response.error,response.description);
                                } else{
                                    funcs.onError({},"",vars.unexpectedError);
                                }
                        });
                });
        });
        // On cancel logout
        $(vars.closeButton).click(function(){
                window.close();
        });
        // On about bookmarklet open modal
        $(vars.about_bookmarklet).click(function(){
                $(vars.about_bookmarklet_modal).foundation('reveal', 'open');
                $(vars.topBar).removeClass('expanded');
                $(vars.topBar).removeAttr('style');
        });
        // Open any external link in a new tab and close the bookmarklet
        $('a[target|="_blank"]').click(function(){
                window.open($(this).attr('href'),'_blank');
                window.close();
        });
        // On logout topbar choice logout
        $(vars.logout).click(function(){
                funcs.deleteCookie(vars.accTokCookie);
                funcs.success(vars.loggedOut,function(){
                        document.location.href = vars.logoutURL;
                    },1000);
        });
});

//Taken from http://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
/* Function: jQuery.limiter
* Arguments: 
* limit - Number of characters to set as a maximum, integer
* elem - jQuery element representing the target object to display the characters remaining
* Task: This is a visual way to set the limit of charactes in a textarea or input
*/
(function($) {
        $.fn.extend( {
                limiter: function(limit, elem) {
                    $(this).on("keyup focus", function() {
                            setCount(this, elem);
                    });
                    function setCount(src, elem) {
                        var chars = src.value.length;
                        if (chars > limit) {
                            src.value = src.value.substr(0, limit);
                            chars = limit;
                        }
                        elem.html( limit - chars );
                    }
                    setCount($(this)[0], elem);
                }
        });
})(jQuery);