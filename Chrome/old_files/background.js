chrome.browserAction.onClicked.addListener(function(tab){
        if(typeof localStorage["accTok"]=="undefined" || localStorage["accTok"]==""){
            localStorage['tabId']=tab.id;
            chrome.tabs.create({'url': chrome.extension.getURL('celly_chrome_options.html')});
        } 
        //Just in case, but no necesary
        else {
            chrome.browserAction.setPopup({popup: 'popup.html'});
        }
});