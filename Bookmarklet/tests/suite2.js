/* 
* Author: Travis Johnson 
* Email: travj@pdx.edu
*/
this.suite2 = {
    'Avatar and user name testing': function (test) {
        //path to my profiles avatar
        //http://cdn-a.cel.ly/celly/images/avatars/avatar87.png
        console.log("________________------------in Avatar");
        test.equal(vars.me.avatar, testVars.avatar, "Avatar found = "+vars.me.avatar);
        test.equal(vars.me.userName, testVars.userName, "User name found = "+vars.me.userName);
        test.done();
    },
    
    'Cell list testing' : function(test) {
        console.log("________________------------in cell list test");
        test.ok(vars.me.cells.length>=1,'Number of cells is at least 1');
        test.done();
    },
    
    'Text area testing' : function(test) {
        console.log("________________------------in test area test");
        test.ok(true, 'insert ?url=http://www.google.com on to the end of the URL to pass this test');
        test.equal(vars.QueryString.url,"http://www.google.com",'URL = '+vars.QueryString.url);
        test.done();
    },
        'No cell No text': function (test) {;
            test.equal(testVars.noCellNoTextResponse,"invalid_request: missing cellId parameter",'Response= '+testVars.noCellNoTextResponse);
            test.done();
        },
    'No cell text': function (test) {
        test.equal(testVars.noCellTextResponse,"invalid_request: missing cellId parameter",'Response= '+testVars.noCellTextResponse);
        test.done();
    },
    'Invalid cell no text': function (test) {
        test.equal(testVars.invalidCellNoTextResponse,"invalid_request: missing cellId parameter",'Response= '+testVars.invalidCellNoTextResponse);
        test.done();
    },
    'Invalid cell text 1': function (test) {
        test.equal(testVars.invalidCellTextResponse,"invalid_request: missing cellId parameter",'Response= '+testVars.invalidCellTextResponse);
        test.done();
    },
    
    'Invalid cell text 2': function (test) {
        test.equal(testVars.invalidCellNegativeTextResponse,"invalid_request: Entity not found or perhaps deleted:-200",'Response= '+testVars.invalidCellNegativeTextResponse);
        test.done();
    },

    'Valid cell no text': function (test) {
        test.equal(testVars.validCellNoTextResponse,"invalid_request: cannot post an empty message",'Response= '+testVars.validCellNoTextResponse);
        test.done();
    },

    'Valid cell text': function (test) {
        test.equal(testVars.validCellTextResponse,"OK",'Response= '+testVars.validCellTextResponse);
        test.equal(testVars.textCheck,testVars.textBody,'Returned Text= '+testVars.textCheck);
        test.done();
    },
    
    'Valid cell maxText': function (test) {
        test.equal(testVars.validCellMaxTextResponse,"OK",'Response= '+testVars.validCellMaxTextResponse);
        test.done();
    },
    
    'Valid cell maxText+1': function (test) {
        test.equal(testVars.validCellMaxTextPlusOneResponse,"invalid_request: message must be at most 420 characters",'Response= '+testVars.validCellMaxTextPlusOneResponse);
        test.done();
    },
};
