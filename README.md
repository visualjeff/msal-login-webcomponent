# msal-login-webcomponent
HTML5 Web Component for Implicit flow authentication.  Includes a component for displaying user details.

1. Start by Registering an app with Azure.
2. For this new app tet your replyTo url to http://localhost:4200
3. Configure the component for authentication by updating the button attributes in index.html:

```
<button
  id="auth-button" 
  is="auth-button" 
  clientId="<<PUT YOUR CLIENTID HERE>>" 
  resource="https://login.microsoftonline.com/<<TENANT>>.onmicrosoft.com" 
  redirectUri="<<PUT YOUR REDIRECT URL HERE>>"
  loggingEnabled=true>Login</button>
```
NOTE: The auth-button webcomponent also support domainHint and loginHint as attributes.  Add if needed.


To test locally on Linux with an HTTP server:

```
python -m SimpleHTTPServer 4200
```

To exercise the login button, open your browser (I use Google Chrome) and go to:  http://localhost:4200/


Enjoy,

Visualjeff
