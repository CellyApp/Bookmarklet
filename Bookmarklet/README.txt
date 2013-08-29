ABOUT: 

This directory will hold the latest details from the Celly bookmarklet project.

GOALS:

* user clicks bookmarklet
* popup window guimelsa.com/celly/post/?url=http://xxx.com/
* In post page, javascript verifies that cookie "access_token" exists (and that it still is valid)
* If not, page redirects to api.cel.ly/api/authorize
* authorize page redirects to guimelsa.com/celly/post/ (with) ?code=<authentication_code> 
* javascript sends a POST request to api.cel.ly/api/token with parameters
* token page returns access_token
* javascript saves access_token to cookie (for later requests)
* javascript makes requests for cells
* user writes the message and select cells
* javascript send messages to each cell and confirm success
* windows is closed automatically
