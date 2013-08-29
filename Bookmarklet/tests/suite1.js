/* 
* Author: Travis Johnson 
* Email: travj@pdx.edu
*/
this.suite1 = {

    
    'Tests': function (test) {
        console.log("________________------------in suite1A");

        function testOauthToken() {
            console.log("___________________-------in Tests");
            test.notEqual(vars.accTok, 'null', 'accessToken= '+vars.accTok);
            
            var cookieTok=funcs.getCookie('access_token');
            test.equal(cookieTok, vars.accTok, 'Test the getCookie');

            //test.done();
        }
        
        console.log("________________------------in suite1B");
        funcs.init(testOauthToken());
        
        /*
        *   I am sending multiple post, they will later be checked by suite2. Suite2 
        * is in a timeout so it waits for the api to come back and fill in the
        * varaibles.
        */
        //The cell id used for testing is TmanJohnson/me:940287018
        
        /*
        *   In our bookmakrlet the gui checks to see if the user has selected a cell 
        * or not and throws a error with in the gui not from the API.  These tests
        * will be testing how the API responds
        */
        
        //No cell No Text present
        var data={"oauth_token" : vars.accTok,"message" : {"body" : "","cellId" :""}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.noCellNoTextResponse=response.error+": "+response.description;        });
        
        //No cell Text present
        var data={"oauth_token" : vars.accTok,"message" : {"body" : testVars.textBody,"cellId" :""}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.noCellTextResponse=response.error+": "+response.description;
        });
        
        //Invalid cell No Text present
        var data={"oauth_token" : vars.accTok,"message" : {"body" : "","cellId" :"aBc"}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.invalidCellNoTextResponse=response.error+": "+response.description;
        });
        
        //Invalid cell Text present 1
        var data={"oauth_token" : vars.accTok,"message" : {"body" : testVars.textBody,"cellId" :"!@#"}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.invalidCellTextResponse=response.error+": "+response.description;
        });
        
        //Invalid cell Text present 2
        var data={"oauth_token" : vars.accTok,"message" : {"body" : testVars.textBody,"cellId" :"-200"}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.invalidCellNegativeTextResponse=response.error+": "+response.description;
        });
        
        //Valid cell no Text
        var data={"oauth_token" : vars.accTok,"message" : {"body" : "","cellId" :testVars.cellId}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.validCellNoTextResponse=response.error+": "+response.description;
        });        
        
        //set up text strings
        testVars.fourHundredChars=testVars.hundredChars+testVars.hundredChars+testVars.hundredChars+testVars.hundredChars;
        testVars.maxText= testVars.fourHundredChars+"12345678901234567890";
        testVars.maxTextPlusOne= testVars.fourHundredChars+"123456789012345678901";
        
        //Valid cell text
        var data={"oauth_token" : vars.accTok,"message" : {"body" : testVars.textBody,"cellId" :testVars.cellId}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.validCellTextResponse=response.stat;
                //testVars.validCellTextResponse=response.error+": "+response.description;
                testVars.textCheck=response.response.body;
        });
        
        //Valid cell maxText
        var data={"oauth_token" : vars.accTok,"message" : {"body" : testVars.maxText,"cellId" :testVars.cellId}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.validCellMaxTextResponse=response.stat;
        });
        
        //Valid cell maxText+1
        var data={"oauth_token" : vars.accTok,"message" : {"body" : testVars.maxTextPlusOne,"cellId" :testVars.cellId}}
        funcs.requestAPI('json','/messages',data,function(response){
                testVars.validCellMaxTextPlusOneResponse=response.error+": "+response.description;
        });
        
        
        test.done();
    },
};
