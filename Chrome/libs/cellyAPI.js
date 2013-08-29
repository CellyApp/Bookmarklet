//Functions
var funcs={
    //Get arguments from current URL
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
    // This functions returns the value of a cookie stored with name 'c_name' in the user's browser    
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
    //This function sets a cookie with name 'c_name' and value 'value' with a very long expiration date
    setCookie:function (c_name,value){
        var c_value=escape(value);
        document.cookie=c_name + "=" + c_value+";domain="+vars.domain+";path=/";
    },
    //delete a cookie of name 'c_name'
    deleteCookie:function(c_name){
        document.cookie = c_name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+vars.domain+";path=/";
    },
    // Request /me endpoint from API, extract information in the response, and execute a 'callback' function
    getMe:function(callback){
        funcs.requestAPI('x-www',"/me?oauth_token="+vars.accTok,'',function(response){
                //If response is correct assign response to 'me', otherwise delete cookie and redirect to authorize page
        		if(response.response && response.response.cells){
                    vars.me=response.response;
                    if(callback) callback();
                } else {
                    localStorage.removeItem(vars.accTokCookie);
                    funcs.createIFrame();
                }
            },"GET");
    },
    //Modified from http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
    // Transforms an object to URL encoding (plain text)
    serialize:function(obj, prefix){
        var str = [];
        for(var p in obj)
            str.push(p+"="+(typeof obj[p]=="object"?encodeURIComponent(JSON.stringify(obj[p])):obj[p]));
        return str.join("&");
    },
    //Detect Internet Explorer version or false if any other browser
    detectBrowser:function(){
        var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
        while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
        return v > 4 ? v : false;
    },
    // POST 'data' to API in an specific 'endpoint' and run 'successFunc' once the response comes back from the server. 
    // 'type' is either json or x-www
    requestAPI:function(cType,endpoint,data,successFunc,protocol){
        var jStringify=JSON.stringify(data);
        var rType=(typeof protocol!="undefined"?protocol:"POST");
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
    //Just log the errors to console, this function can be overwritten to show errors to the user.
    onError:function(xhr, status, error){
        console.log("Error status: "+status);
        console.log("Error: "+error);
    },
    init:function(callback){
        callback=callback||function(){};
        //try to get token
        if(localStorage[vars.accTokCookie]==null){
            //If QueryString has the 'code', it means the app has just been authorized, if not redirect to authorize page
            if(typeof vars.QueryString.code=="undefined"){
                //redirect
            	funcs.createIFrame();
            	return;
            }
            // Send 'data' to request the token and save it in cookie for future requests
            var data={client_id:vars.client_id,client_secret:vars.client_secret,grant_type:"authorization_code",redirect_uri:"blah",code:vars.QueryString.code};
            funcs.requestAPI('x-www','/token',data,function(response){
                    vars.accTok=response.access_token;
                    if(vars.accTok!=null && typeof vars.accTok!="undefined"){
                    	console.log('save access_token to localStorage');
                    	localStorage[vars.accTokCookie] = vars.accTok;
                    }
                	funcs.create_wrapper("main_wrapper","100%","100%");
                    funcs.getMe(callback);
            });
        } else {
        	vars.accTok = localStorage[vars.accTokCookie];
        	funcs.create_wrapper("main_wrapper","600px","400px");
            funcs.getMe(callback);
        }
    },
    create_wrapper:function(wrapper_id,width,height){
    	var wrapper = document.createElement('div');
        wrapper.id = wrapper_id;
    	wrapper.style.width = width;
    	wrapper.style.height = height;
    	document.body.innerHTML = "";
    	document.body.appendChild(wrapper);
    },
    createIFrame:function(){
    	var myFrame = document.createElement('iframe');
    	myFrame.id="wrapper_ifr";
    	myFrame.width = '600px';
    	myFrame.height = '400px';
    	myFrame.frameBorder = 0;
    	myFrame.src =  vars.apiURL+"/authorize?client_id="+vars.client_id+"&redirect_uri="+vars.redirectURL+"&scope=BASIC";
    	document.body.innerHTML = "";
    	document.body.appendChild(myFrame);
    }
};
//Variables
var vars={
    client_id:"",
    client_secret:"",
    apiURL:"http://api.cel.ly/api",
    redirectURL:"",
    domain:"",
    QueryString:{},
    dropDown:"",
    accTok:null,
    accTokCookie:"access_token",
    ie:false,
    me:{}
}
vars.QueryString=funcs.getArguments();
vars.ie=funcs.detectBrowser();
