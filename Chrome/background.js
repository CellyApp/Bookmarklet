//*************************** Desktop Notification*******************************

var NotIdM = {};

/*
 * Desktop Notification
 */
// Declare a variable to generate unique notification IDs
var notID = 0;

// set up the event listeners
chrome.notifications.onClosed.addListener(notificationClosed);
chrome.notifications.onClicked.addListener(notificationClicked);
chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
 
function notificationClosed(notID, bByUser) {
	console.log("The notification '" + notID + "' was closed" + (bByUser ? " by the user" : ""));
}

function notificationClicked(notID) {
	console.log("The notification '" + notID + "' was clicked");
}

function notificationBtnClick(notID, iBtn) {
	console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
	console.log('http://cel.ly/u/'+NotIdM[notID]+'/message');
	window.open('http://cel.ly/u/'+NotIdM[notID]+'/message','_newtab');
}

function creationCallback(notID) {
	console.log("Succesfully created " + notID + " notification");
}

/*
 * Setup GCM Receiver
 */
function channelIdCallback(message) {
	console.log("Background Channel ID callback seen, channel Id is " + message.channelId);
}

//Log and display the results when a push message arrives.
function reportDetails(details) {
  console.log("Received Message!");
  console.log("subchannel - " + details.subchannelId);
  console.log("payload - " +  details.payload);

  // Show a notification with these details.
  showPushMessage(details.payload, details.subchannelId);
}

// When a Push Message arrives, show it as a text notification (toast).
function showPushMessage(payload, subchannelId) {
  var payload_obj = JSON.parse(payload);
  
  var img_url = payload_obj.avatar;
  if(img_url==null)
	  img_url = "/images/ntf-imgs/icon48.png";
  else
	  img_url = "http://cdn-a.cel.ly/celly/images/avatars/" + img_url + ".png";

  // Create the right notification for the selected type
  var options = {
					type : "basic",
					title: decodeURIComponent(payload_obj.sender),
					message:  decodeURIComponent(payload_obj.content)
	 	        };
	
  options.iconUrl = img_url;
		  
  options.buttons = [];
  options.buttons.push({ title: 'Reply',
						 iconUrl: "/images/ntf-imgs/email.png"});
  
  NotIdM["id"+notID] = decodeURIComponent(payload_obj.sender);
  chrome.notifications.create("id"+notID, options, creationCallback);
  ++notID;
}

console.log("Celly Push Messaging Client Launched!");
//Start fetching the channel ID (it will arrive in the callback).
chrome.pushMessaging.getChannelId(true, channelIdCallback);
console.log("getChannelId returned.  Awaiting callback...");
//Begin listening for Push Messages.
chrome.pushMessaging.onMessage.addListener(reportDetails);
console.log('called addListener');

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.browserAction.setPopup({popup: 'popup.html'});
});