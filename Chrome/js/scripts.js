var message;
//You need to get and fill in your own credentials below.
var clientId = '20164660236-d949seiom0r3s1b8qgrc91n5fbk0n586.apps.googleusercontent.com';
var clientSecret =  'lMZ50EdOomcwStmXXJM-UB0V';
var refreshToken = '1/WQfC9b-i0AROliOvqR0tjsSVA8Nuzdc-fg_h0GGbhaU';

var celIdM = {"940305263" : "02730513402834611522/llfiihiiehmiaecnmiecaighjkjmpjmc",
			  "940293291" : "05531274748405420869/llfiihiiehmiaecnmiecaighjkjmpjmc",
			  "940279700" : "01304324005674687174/llfiihiiehmiaecnmiecaighjkjmpjmc",
			  "940279228" : "04408248684202209019/llfiihiiehmiaecnmiecaighjkjmpjmc"
			 };

function getAccessToken(channelId) {
  var tokenRequest = new XMLHttpRequest();
  var tokenUrl = 'https://accounts.google.com/o/oauth2/token';
  tokenRequest.open('POST', tokenUrl, true);
  tokenRequest.setRequestHeader('Content-Type',
                                'application/x-www-form-urlencoded');
  var tokenData = 'client_secret=' + clientSecret + '&' +
                  'grant_type=refresh_token&' +
                  'refresh_token=' + refreshToken + '&' +
                  'client_id=' + clientId;
  tokenRequest.onreadystatechange = function (theEvent) {
    if (tokenRequest.readyState === 4) {
      if (tokenRequest.status === 200) {
        console.log("First XHR returned, " + tokenRequest.response);

        // Parse the access token out of the XHR message.
        var parsedResponse = JSON.parse(tokenRequest.response);
        var accessToken = parsedResponse.access_token;

        askServerToSendPushMessageWithToken(accessToken,channelId);
      } else {
        console.log('Error sending first XHR, status is ' +
                    tokenRequest.statusText);
      }
    }
  }

  // Send the XHR with the data we need.
  console.log("Sending first XHR, data is " + tokenData);
  tokenRequest.send(tokenData);
}

// Now that we have an access token, use it to send the message.
function askServerToSendPushMessageWithToken(accessToken,channelId) {
  // Setup the push request, using the access token we just got.
  
  var payload = {sender: encodeURIComponent(vars.me.userName),
				 content: encodeURIComponent(message),
				 avatar: encodeURIComponent(vars.me.avatar)};
  var payload_str = JSON.stringify(payload);
  payload_str = payload_str.replace(/\"/g,'\\\"');

  console.log(payload_str);
  var channelNum = 0;
  var pushURL ='https://www.googleapis.com/gcm_for_chrome/v1/messages';
  var pushData = '{"channelId": "' + channelId + '", ' +
                 '"subchannelId": "'  + channelNum +  '", ' +
                 '"payload": "'+ payload_str +'"}';
  var pushRequest = new XMLHttpRequest();
  pushRequest.open('POST', pushURL, true);
  // Set the headers for the push request, including the parsed accessToken.
  pushRequest.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  pushRequest.setRequestHeader('Content-Type', 'application/json');
  pushRequest.onreadystatechange = function (theEvent) {
    if (pushRequest.readyState === 4) {
      if (pushRequest.status === 200) {
        console.log("second XHR returned, " + pushRequest.response);
      } else {
        console.log('Error sending second XHR, status is ' +
                     pushRequest.statusText + ' body is ' +
                     pushRequest.response);
      }
     
    }
  }

  // Send the push request.
  console.log("sending second XHR, data is " + pushData);
  pushRequest.send(pushData);
}

//****************************** Bookmarklet Dialog *******************************
//variables REQUIRED by cellyAPI
vars.client_id="afdc8877-80c0-4256-9f5c-a8e90775b325";
vars.client_secret="18901231-bc27-4ad0-a77c-29a7d62ca00a";
vars.redirectURL="chrome-extension://" + chrome.runtime.id + "/popup.html";

//local variables
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
//Messages
vars.messageText="Hey, check out this website: ";
vars.successMessage="Post Successful";
vars.loggedOut="Logged out successfully";
vars.unexpectedError="The website encountered an unexpected error. Please try again later.";
vars.noCellsSelected ="You must select at least one cell.";

//Extended functions from cellyAPI

//Add list of 'cells' to the dropdown and put in user name and logo
funcs.populateCells=function(){
	
	$("#main_wrapper").load('main_wrapper.html',function(){
		for(var i=0;i<vars.me.cells.length;i++){
	        $(vars.dropDown).append($("<option></option>").attr("value",vars.me.cells[i].entityId).text(vars.me.cells[i].name));
	    }
	    $('.chzn-select').chosen({width: "100%"});
	    if(vars.me.hasAvatar && vars.me.avatar) $(vars.usrLogo).append($("<img>").attr('src',"http://cdn-a.cel.ly/celly/images/avatars/"+vars.me.avatar+".png"));
	    if(vars.me.userName) $(vars.usrName).html("@"+vars.me.userName);
	    
        $('#post_textarea').html(vars.messageText + vars.QueryString.url);
        if(localStorage['background-img'])
        	$('body').css('background','url(images/setting_imgs/'+localStorage['background-img']+')');
        
        document.getElementById("post_button").addEventListener('click', function(){
           console.log('post button clicked');
           // post message for each cell selected
           if($('.chzn-select :selected').length==0) funcs.onError({},'',vars.noCellsSelected)
	           $.each($('.chzn-select').val(),function(key,value){
	                   var data={"oauth_token" : vars.accTok,"message" : {"body" : $(vars.textArea).val(),"cellId" : value}}
	                   funcs.requestAPI('json','/messages',data,function(response){
	                       //TODO: verify that each request was done successful, and then call just one time either to the success or onError function
	                           //Verify that response is correct, otherwise there was an error
	                           if(response.stat && response.stat=="OK" && response.response.time){
	                        	   message = $(vars.textArea).val();
	                        	   var channelId = celIdM[value];
	                        	   if(channelId != null)
	                        		   getAccessToken(channelId);
	                        	   funcs.success(vars.successMessage);
	                           } else if(response.error && response.description) {
	                               funcs.onError({},response.error,response.description);
	                           } else{
	                               funcs.onError({},"",vars.unexpectedError);
	                           }
	                   });
           });
        });
        
        document.getElementById("close_button").addEventListener('click', function(){
            console.log('close button clicked');
            top.window.close();
        });
        
        document.getElementById("setting_img").addEventListener('click', function(){
            console.log('setting image clicked');
            $("#main_wrapper").load('setting_wrapper.html',function(){
            	var blacklist_map = {};
            	if(localStorage['blacklist'] != null)
            		blacklist_map = JSON.parse(localStorage['blacklist']);
            	
            	for(var i=0;i<vars.me.cells.length;i++){
            		var opt = $("<option></option>");
            		opt.attr("value",vars.me.cells[i].entityId).text(vars.me.cells[i].name);
            		if(blacklist_map[vars.me.cells[i].entityId] == vars.me.cells[i].entityId)
            			opt.attr("selected",true);
        	        $("#blockDropDown").append(opt);
        	    }
            	
        	    $('.chzn-select').chosen({width: "90%"});
        	    $('.chzn-results').css("max-height","125px");
            	if(vars.me.hasAvatar && vars.me.avatar) $(vars.usrLogo).append($("<img>").attr('src',"http://cdn-a.cel.ly/celly/images/avatars/"+vars.me.avatar+".png"));
         	    if(vars.me.userName) $(vars.usrName).html("@"+vars.me.userName);

         	    $(".dropdown img.flag").addClass("flagvisibility");
         	    if(localStorage['background-img'])
         	    	$("#sample dt a").html('<img class="flag" src="images/setting_imgs/' + localStorage['background-img'] + '" alt=""><span class="value">'+localStorage['background-img']+'</span>');
         	    
         	    
                $("#sample dt a").click(function() {
                   $("#sample dd ul").toggle();
                   if($("#notification_timeout dd ul").css('display')!='none')
                	   $("#notification_timeout dd ul").toggle();
                });
                 
                
               $("#sample dd ul li a").click(function() {
                   var text = $(this).html();
                   $("#sample dt a").html(text);
                   $("#sample dd ul").hide();
               });
               
               $(document).bind('click', function(e) {
                   var $clicked = $(e.target);
                   if (! $clicked.parents().hasClass("dropdown"))
                       $(".dropdown dd ul").hide();
               });

         	    document.getElementById("save_button").addEventListener('click', function(){
	               var img_text = $('#sample dt').find('span').html();
	               localStorage['background-img'] = img_text;
	               //save blacklist
	               var blacklist_map = {};
	               if($('.chzn-select').val()!=null)
		               $.each($('.chzn-select').val(),function(key,value){
		            	   blacklist_map[value] = value;
			               		  });
	               localStorage['blacklist'] = JSON.stringify(blacklist_map);
	               funcs.populateCells();
	            });
         	    
         	    document.getElementById("cancel_button").addEventListener('click', function(){
	               console.log('cancel button clicked');
	               funcs.populateCells();
	            });
         	    
         	    document.getElementById("logout_button").addEventListener('click', function(){
        	    	console.log(localStorage[vars.accTokCookie]);
        	    	localStorage.removeItem(vars.accTokCookie);
        	    	top.window.close();
        	    });
            });
        });
        
        $(document).foundation();
	});
		
};
//Overwrite onError function to display the errors to the user
funcs.onError = function(xhr, status, error) {
	$(vars.failureAlert).foundation('reveal', 'open');
	$(vars.failureAlert + " label").html(
			"Error" + (status != "" ? " " : "") + status + ": " + error);
}
//Display success 'message' and close the window (or executes action) after 5 seconds or after clicking in 'x'
funcs.success = function(message, action, wait) {
	$(vars.successAlert).foundation('reveal', 'open');
	action = action || function() {
		window.close()
	};
	wait = wait || 5000;
	$(vars.successAlert + " label").html(message);
	$(vars.successAlert + " a").click(action);
	window.setTimeout(action, wait);
}
