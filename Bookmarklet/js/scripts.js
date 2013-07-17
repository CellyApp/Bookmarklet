var funcs={
    getArguments:function() { //GET URL arguments
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]], pair[1] ];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        } 
        return query_string;
    },    
    getCookie:function (c_name) { // This functions returns the value of a cookie stored with name 'c_name' in the user's browser
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1){
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1){
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start,c_end));
        }
        return c_value;
    },
    setCookie:function (c_name,value) { //This function sets a cookie with name 'c_name' and value 'value' with a very long expiration date
        var exdate=new Date();
        exdate.setTime(exdate.getTime()+2000000000);
        var c_value=escape(value) + "; expires="+exdate.toUTCString();
        document.cookie=c_name + "=" + c_value+";domain=.guimelsa.com;path=/";
    },
    createCORSRequest:function (method, url) { 
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // Otherwise, CORS is not supported by the browser.
            xhr = null;
        }
        return xhr;
    },
    getCells:function(){
        var url=vars.apiURL+"/me?oauth_token="+accTok;
        var xhr = funcs.createCORSRequest('GET', url);
        xhr.onload = function() {
            var responseText = xhr.responseText;
            var responseJSON=$.parseJSON( responseText );
            funcs.populateCells(responseJSON['response']['cells']);
        };
        xhr.onerror = function() {
            console.log('There was an error!');
            //TODO: try again, otherwise notify user
        };
        xhr.send(); 
    },
    populateCells:function(cells){
        for(var i=0;i<cells.length;i++){
            $(vars.dropDown).append($("<option></option>").attr("value",cells[i].entityId).text(cells[i].name));
        }
        $('.chzn-select').chosen({});
    },
    postCORS:function(URI,onLoadFunc,data,type){
        var xhr = funcs.createCORSRequest('POST', vars.apiURL+URI);
        xhr.withCredential = "true";
        xhr.setRequestHeader('Content-Type', 'application/'+(type=='json'?'json':'x-www-form-urlencoded'));
        if (!xhr) {
            throw new Error('CORS not supported');
        }
        xhr.onload =onLoadFunc;
        xhr.onerror = function() {
            console.log('There was an error!');
        };
        var dataToSend=(type=='json'?JSON.stringify(data):funcs.serialize(data));
        xhr.send(funcs.serialize(data));
        return xhr;
    },
    postXwwwForm:function(URI,onLoadFunc,data){
        return funcs.postCORS(URI,onLoadFunc,data,'x-www');
    },
    postJSON:function(URI,onLoadFunc,data){
        return funcs.postCORS(URI,onLoadFunc,data,'json');
    },
    closeWindow: function(){
            window.close();
    }
};

var vars={
    client_id:"", // removed for security
    client_secret:"", // removed for security
    apiURL:"http://api.cel.ly/api",
    postURL:"http://guimelsa.com/celly/bookmarklet/post/",
    QueryString:{},
    textArea:"#post_textarea",
    dropDown:"#cellDropDown"
}
vars.QueryString=funcs.getArguments();
var accTok=funcs.getCookie('access_token');
if(accTok==null){
    if(typeof vars.QueryString.code=="undefined"){
        document.location.href = vars.apiURL+"/authorize?client_id="+vars.client_id+"&redirect_uri="+vars.postURL+"?url="+encodeURIComponent(vars.QueryString.url)+"&scope=BASIC";
    }
    var data={client_id:vars.client_id,client_secret:vars.client_secret,grant_type:"authorization_code",redirect_uri:"blah",code:vars.QueryString.code};
    var xhr=funcs.postXwwwForm("/token",function() {
            var responseText = xhr.responseText;
            var responseJSON=$.parseJSON( responseText );
            accTok=responseJSON['access_token'];
            if(accTok!=null && typeof accTok!="undefined"){
                funcs.setCookie("access_token",responseJSON['access_token']);
            }
            funcs.getCells();
        },data);
} else {
    funcs.getCells();
}
$(document).ready(function(){
        $(vars.textArea).text("This is your desired URL - " + decodeURIComponent(vars.QueryString.url));

        {message:{body:"some text"}};
        $("#post_button").click(function(){
                $.each($('.chzn-select').val(),function(key,value){
                        var data={
                            "oauth_token" : accTok,
                            "message" : {
                                "body" : $(vars.textArea).val(),
                                "cellId" : value,
                                "type" : "DIRECT"    // Optionally add this if cellId is a userId, and this is a direct message
                            }
                        }
                        var xhr=funcs.postJSON("/messages",function() {
                                console.log(xhr.responseText);
                                var responseJSON=$.parseJSON( responseText );
                            },data);
                });
        });
        $("#cancel_button").click(function(){
            funcs.closeWindow();
        })
});
