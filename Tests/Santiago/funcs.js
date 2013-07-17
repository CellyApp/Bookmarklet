var doc=document,attrs={
    QueryString:{}
},funcs={
    init:function(){
        doc.b=doc.getElementsByTagName("BODY")[0];
        attrs.QueryString=funcs.getArguments();
        attrs.url=decodeURIComponent(attrs.QueryString.url)||"";
        funcs.addElements();
    },
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
    make:function(objs){
        var newElement=false,d,e;
        for(d in objs){ 
            if(objs[d].hasOwnProperty){
                newElement=doc.createElement(d);
                for(e in objs[d])
                    objs[d][e].hasOwnProperty&&typeof objs[d][e]==="string"&&funcs.set(newElement,e,objs[d][e]);
                break
            }
        }
        return newElement
    },
    set:function(Element,prop,value){
        if(typeof Element[prop]==="string") Element[prop]=value;
        else Element.setAttribute(prop,value)
    },
    addElements:function(){
        var f=funcs.make({FORM:{id:"postToCell"}});
        var t=funcs.make({TEXTAREA:{rows:"4",cols:"50",value:"Hey, check out this website: "+attrs.url}});
        f.appendChild(t);
        doc.b.appendChild(f);
    }
};
window.onload=function(){
    funcs.init();
}