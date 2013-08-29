function save_options() {
  var select = document.getElementById("accTok");
  var accTok = select.value;
  localStorage["accTok"] = accTok;
  chrome.browserAction.setPopup({popup: 'popup.html'});
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var accTok = localStorage["accTok"];
  if (!accTok) {
    return;
  }
  var select = document.getElementById("accTok");
  select.value = accTok;
}
document.addEventListener('DOMContentLoaded', restore_options);
var savebtn=document.querySelector('#save').addEventListener('click', save_options);