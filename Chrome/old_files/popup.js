var cellyGenerator = {
  run: function (tab) {
	var setting_div = document.createElement("div");
	setting_div.style.width = "100%";
	setting_div.style.height = "50px";
	setting_div.style.textAlign = "right";
	setting_div.style.marginBottom = "-50px";
	setting_div.innerHTML = '<img src="images/gear-icon.png" style="margin-left:-50px; z-index:300; position: absolute;" ></img>';
	document.body.appendChild(setting_div);
    var myFrame = document.createElement('iframe');
    myFrame.width = '600px';
    myFrame.height = '500px';
    myFrame.frameBorder = 0;
    myFrame.src =  'http://www.guimelsa.com/celly/chome-bookmarklet-content/post/?url='+tab.url;
    document.body.appendChild(myFrame);
  },
};
// Run our celly-bookmarklet generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.getSelected(null, cellyGenerator.run);
});

