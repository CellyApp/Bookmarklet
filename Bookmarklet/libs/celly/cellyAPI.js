//Functions
var funcs={
    
    /* Function: getArguments
     * Arguments: NONE
     * Task: Get parameters (arguments of POST) from current URL
     */
    getArguments:function() {
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
    /* Function: getCookie
     * Arguments: 
     * c_name - name of the cookie
     * Task: This functions returns the value of a cookie 
     * stored with name 'c_name' in the user's browser
     */
    getCookie:function (c_name) { 
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1){ c_start = c_value.indexOf(c_name + "="); }
        if (c_start == -1){ c_value = null; }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) { c_end = c_value.length; }
            c_value = unescape(c_value.substring(c_start,c_end));
        }
        return c_value;
    },
    /* Function: setCookie
     * Arguments: 
     * c_name - name of the cookie
     * value - the storage value of the cookie (auth code from API Server)
     * Task: This function sets a cookie with name 'c_name' 
     * and value 'value' with a very long expiration date
     */
    setCookie:function (c_name,value){
        var c_value=escape(value);
        document.cookie=c_name + "=" + c_value+";domain="+vars.domain+";path=/";
    },
    /* Function: deleteCookie
     * Arguments: 
     * c_name - name of the cookie
     * Task: delete a cookie of name 'c_name'
     */
    deleteCookie:function(c_name){
        document.cookie = c_name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+vars.domain+";path=/";
    },
    /* Function: getMe
     * Arguments: 
     * callback - any callback functions passed to this function
     * Task: Request /me endpoint from API, 
     * extract information in the response, and 
     * execute a 'callback' function
     */
    getMe:function(callback){
        funcs.requestAPI('x-www',"/me?oauth_token="+vars.accTok,'',function(response){
                //If response is correct assign response to 'me', otherwise delete cookie and redirect to authorize page
                if(response.response && response.response.cells){
                    vars.me=response.response;
                    if(callback) callback(); // Runs the argument callback function
                } else{
                    funcs.deleteCookie(vars.accTokCookie);
                    document.location.href = vars.apiURL+"/authorize?client_id="+vars.client_id+"&redirect_uri="+vars.redirectURL+"&scope=BASIC";
                }
            },"GET");
    },
    /* Function: serialize
     * Arguments: 
     * obj - value to be encoded
     * Task: Transforms an object to URL encoding (plain text)
     * Modified Source: http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
     */
    // TODO: REMOVE unused 'prefix' variable
    serialize:function(obj, prefix){
        var str = [];
        for(var p in obj)
            str.push(p+"="+(typeof obj[p]=="object"?encodeURIComponent(JSON.stringify(obj[p])):obj[p]));
        return str.join("&");
    },
    /* Function: detectBrowser
     * Arguments: NONE
     * Task: Detect Internet Explorer version or false if any other browser
     */
    detectBrowser:function(){
        var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
        while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
        return v > 4 ? v : false;
    },
    /* Function: requestAPI
     * Arguments: 
     * cTYpe - browser encoding type
     * endpoint - API Server endpoint to call
     * data - object to be sent to API function
     * successFunc - functiont to run upon success
     * protocal - request protocol type
     * Task: POST 'data' to API in an specific 'endpoint' and run 'successFunc' 
     * once the response comes back from the server.
     * 'type' is either json or x-www
     */
    requestAPI:function(cType,endpoint,data,successFunc,protocol){
        // Change 'data' to JSON object
        var jStringify=JSON.stringify(data);
        // Set form protocol to POST if not already
        var rType=(typeof protocol!="undefined"?protocol:"POST");
        // API server with necessary endpoint added
        var url=vars.apiURL+endpoint;
        //if IE 9 and POSTing using JSON then use x-www instead 
        if(rType == "POST" && vars.ie && vars.ie<=9&& cType=='json'){
            cType='x-www';
        }

        var dataToSend=(cType=='json'?jStringify:funcs.serialize(data));
        $.ajax({
                type:rType,url:url,data:dataToSend,dataType: "json",cache: false,
                contentType: "application/"+(cType=='json'?'json':"x-www-form-urlencoded"),
                success: successFunc,
                error: funcs.onError
        });
    },
    /*
     * Function: onError
     * Arguments:
     * status - type of error from API Server
     * error - description of the error
     * Task: Overwrite onError function to display the errors to
     * the user
     */
    onError:function(xhr, status, error){
        console.log("Error status: "+status);
        console.log("Error: "+error);
    },
    init:function(callback){
        // Set the callback function variable, or else make it empty function
        callback=callback||function(){};
        //try to get token
        vars.accTok=funcs.getCookie('access_token');
        // Conditional loop: if token is null (not there)
        if(vars.accTok==null){
            //If QueryString has the 'code', it means the app has just been authorized, if not redirect to authorize page
            if(typeof vars.QueryString.code=="undefined"){
                //redirect
                document.location.href = vars.apiURL+"/authorize?client_id="+vars.client_id+"&redirect_uri="+vars.redirectURL+"&scope=BASIC";
            }
            // Build 'data' variable to pass to requestAPI
            var data={client_id:vars.client_id,client_secret:vars.client_secret,grant_type:"authorization_code",redirect_uri:"blah",code:vars.QueryString.code};
            // Send 'data' to request the token and save it in cookie for future requests
            funcs.requestAPI('x-www','/token',data,function(response){
                    vars.accTok=response.access_token;
                    if(vars.accTok!=null && typeof vars.accTok!="undefined"){
                        funcs.setCookie(vars.accTokCookie,vars.accTok);
                    }
                    funcs.getMe(callback); // send callback function to getMe
            });
        } else {
            funcs.getMe(callback); // send callback function to getMe
        }
    }
};
vars.QueryString=funcs.getArguments();
vars.ie=funcs.detectBrowser();
