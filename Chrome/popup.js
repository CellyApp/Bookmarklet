var cellyGenerator = {
  run: function (tab) {
	  vars.QueryString.url = tab.url;
	  funcs.init(funcs.populateCells);
  },
};
// Run our celly-bookmarklet generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.getSelected(null, cellyGenerator.run);
});

