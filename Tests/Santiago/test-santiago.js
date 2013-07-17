(function(win,doc,prop){
        var c={
            s:{},
            f:function(){
                return{
                    init:function(){
                        doc.d=doc.documentElement;
                        doc.b=doc.getElementsByTagName("BODY")[0];
                        c.v={css:""};
                        c.f.makeStyleFrom(prop.presentation);
                        c.f.structure();
                        c.f.presentation();
                        c.f.listen(doc,"click",c.f.click);
                    },
                    make:function(obj){
                        var newElement=false,d,e;
                        for(d in obj) 
                        if(obj[d].hasOwnProperty){
                            newElement=doc.createElement(d);
                            for(e in obj[d])
                                obj[d][e].hasOwnProperty&&typeof obj[d][e]==="string"&&c.f.set(newElement,e,obj[d][e]);
                            break
                        }
                        return newElement
                    },
                    set:function(b,c,d){
                        if(typeof b[c]==="string") b[c]=d;
                        else b.setAttribute(c,d)
                    },
                    makeStyleFrom:function(b,z){
                        var d,e,f,h;
                        d="";
                        z=z||"";
                        for(f in b){
                            if(b[f].hasOwnProperty) {
                                if(typeof b[f]==="string") d=d+f+": "+b[f]+"; ";
                            }
                        }
                        if(z&&d) c.v.css=c.v.css+z+" { "+d+"}\n";
                        for(f in b){
                            if(b[f].hasOwnProperty)
                                if(typeof b[f]==="object"){
                                d=f.split(", ");
                                for(e=0;e<d.length;e+=1){
                                    h="";
                                    if(d[e].match(/^&/)) d[e]=d[e].split("&")[1];
                                    else if(z) h=" ";
                                    c.f.makeStyleFrom(b[f],z+h+d[e].replace(/^\s+|\s+$/g,""))
                                }
                            }
                        }
                    },
                    structure:function(){
                        c.s.bg=c.f.make({DIV:{id:prop.k+"_bg"}});
                        doc.b.appendChild(c.s.bg);
                        c.s.bd=c.f.make({DIV:{id:prop.k+"_bd"}});
                        c.s.hd=c.f.make({DIV:{id:prop.k+"_hd"}});
                        c.s.par=c.f.make({DIV:{id:prop.k+"_par"}});
                        c.s.par.appendChild(c.f.make({P:{innerHTML:"Hello Celly Team!"}}));
                        c.s.par.appendChild(c.f.make({P:{innerHTML:";-)"}}));
                        c.s.hd.appendChild(c.s.par);
                        c.s.x=c.f.make({A:{id:prop.k+"_x",innerHTML:"Cancel"}});
                        c.s.hd.appendChild(c.s.x);
                        c.s.bd.appendChild(c.s.hd);
                        doc.b.appendChild(c.s.bd);
                    },
                    presentation:function(){
                        var b,z,d;
                        b=c.f.make({STYLE:{type:"text/css"}});
                        d=c.v.css;
                        d=d.replace(/#_/g,"#"+prop.k+"_");
                        d=d.replace(/\._/g,"."+prop.k+"_");
                        d=d.replace(/;/g,"!important;");
                        d=d.replace(/_rez/g,c.v.resolution);
                        b.appendChild(doc.createTextNode(d));
                        doc.h?doc.h.appendChild(b):doc.b.appendChild(b)
                    },
                    listen:function(b,c,d,e){
                        if(e)
                            if(typeof b.removeEventListener!=="undefined") b.removeEventListener(c,d,false);
                        else typeof b.detachEvent!=="undefined"&&b.detachEvent("on"+c,d);
                        else if(typeof win.addEventListener!=="undefined")b.addEventListener(c,d,false);
                        else typeof win.attachEvent!=="undefined"&&b.attachEvent("on"+c,d)
                    },
                    getEl:function(b){
                        var z=null;
                        return z=b.target?b.target.nodeType===3?b.target.parentNode:b.target:b.srcElement
                    },
                    click:function(b){
                        b=c.f.getEl(b||win.event);
                        if(b===c.s.x){
                            c.f.close()
                        }
                    },
                    close:function(){
                        window.hazPinningNow=false;
                        if(c.s.bg){
                            c.f.listen(doc,"keydown",c.f.keydown,"detach");
                            c.f.listen(doc,"click",c.f.click,"detach");
                            c.f.kill(c.s.bg);
                            c.f.kill(c.s.bd);
                        }
                    },
                    kill:function(b){
                        if(typeof b==="string") b=doc.getElementById(b);
                        b&&b.parentNode&&b.parentNode.removeChild(b)
                    }
                }
            }()
        }
        c.f.init()
})(window,document,{
        k:"DIV_"+(new Date).getTime(),
        presentation:{
            "div#_bg":{
                position:"fixed",
                top:"0px",
                left:"0px",
                right:"0px",
                bottom:"0px",
                height:"100%",
                width:"100%",
                background:"none repeat scroll 0% 0% rgba(238, 238, 255,0.8)",
                "z-index":"2147483641"
            },
            "div#_bd":{
                "z-index":"2147483642",
                "text-align":"center",
                position:"absolute",
                width:"80%",
                top:"150px",
                left:"10%",
                right:"10%",
                font:"16px hevetica neue,arial,san-serif",
                "div#_hd":{
                    "z-index":"2147483643",
                    "-moz-box-shadow":"0 1px 2px #aaa",
                    "-webkit-box-shadow":"0 1px 2px #aaa",
                    "box-shadow":"0 1px 2px #aaa",
                    position:"fixed",
                    "*position":"absolute",
                    width:"80%",
                    top:"150px",
                    left:"10%",
                    right:"10%",
                    height:"200px",
                    "line-height":"100px",
                    "font-size":"14px",
                    "font-weight":"bold",
                    display:"block",
                    margin:"0",
                    background:"#c0c0c0",
                    "border-bottom":"1px solid #aaa",
                    "&._noHeader":{
                        height:"1px",
                        "background-color":"#f2f2f2",
                        "-moz-box-shadow":"none",
                        "-webkit-box-shadow":"none",
                        "box-shadow":"none",
                        border:"none"
                    },
                    "a#_x":{
                        display:"inline-block",
                        cursor:"pointer",
                        color:"#524D4D",
                        "line-height":"45px",
                        "text-shadow":"0 1px #fff",
                        "float":"right",
                        "text-align":"center",
                        width:"100px",
                        "border":"1px solid #686868",
                        "margin-top":"155px",
                        background:"rgba(255,255,255,0.1)",
                        "&:hover":{
                            color:"#524D4D",
                            background:"#D0D0D0",
                            "text-decoration":"none"
                        },
                        "&:active":{
                            color:"#fff",
                            background:"#006600",
                            "text-decoration":"none",
                            "text-shadow":"none"
                        }
                    },
                    "div#_par":{
                        float: "left",
                        width: "70%",
                        "margin-left": "15%",
                        height: "200px",
                        p:{
                            "font-size": "40px",
                            "font-family": "Times New Roman",
                            margin: "0",
                            color: "#0000FF",
                            "text-shadow": "2px 1px #000"
                        }
                    }
                }
            }
        }
});