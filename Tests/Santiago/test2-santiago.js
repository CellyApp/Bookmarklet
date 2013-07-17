var doc=document,
attrs={
    css:"",
    cssObj:{
        "iframe#cellyFrame":{
            position: "fixed",
            top: "100px",
            left: "400px",
            background: "white",
            width: "500px",
            height: "200px",
            border: "outset"
        }
    }
},
funcs={ 
    init:function(){
        doc.b=doc.getElementsByTagName("BODY")[0];
        funcs.makeStyleFrom(attrs.cssObj);
        var b=funcs.make({STYLE:{type:"text/css"}});
        var div=doc.getElementById('cellybmrklt');
        b.appendChild(doc.createTextNode(attrs.css));
        div.appendChild(b);
        div.appendChild(funcs.make({IFRAME:{id:"cellyFrame",name:"cellyFrame",src:"//guimelsa.com/celly/html-forms/hello.html"}}));
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
    makeStyleFrom:function(cssObj,selector){
        var cssTxt,e,cssProperty,h,value;
        cssTxt="";
        selector=selector||"";
        for(cssProperty in cssObj){
            value=cssObj[cssProperty];
            if(value.hasOwnProperty) {
                if(typeof value==="string") cssTxt=cssTxt+cssProperty+": "+value+"; ";
            }
        }
        attrs.css=attrs.css+selector+" { "+cssTxt+"}\n";
        for(cssProperty in cssObj){
            value=cssObj[cssProperty];
            if(value.hasOwnProperty){
                if(typeof value==="object"){
                    var cssInternalObj=cssProperty.split(", ");
                    for(e=0;e<cssInternalObj.length;e+=1){
                        h="";
                        if(cssInternalObj[e].match(/^&/)) cssInternalObj[e]=cssInternalObj[e].split("&")[1];
                        else if(selector) h=" ";
                        funcs.makeStyleFrom(value,selector+h+cssInternalObj[e].replace(/^\s+|\s+$/g,""))
                    }
                }
            }
        }
    }
}
funcs.init();