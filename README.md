# msal-login-webcomponent
HTML5 WebComponent for Implicit flow authentication.  Additionally includes a component for displaying user and token information.

1. Start by Registering an App (app registrations) with Azure Active Directory.
2. For this new App, set the reply URL's to http://localhost:4200
3. Configure the webcomponent for authentication by updating the button attributes (clientId and resource) in index.html:

```
<button
  id="auth-button" 
  is="auth-button" 
  clientId="<<PUT YOUR CLIENTID HERE>>" 
  resource="https://login.microsoftonline.com/<<TENANT>>.onmicrosoft.com" 
  redirectUri="<<PUT YOUR REDIRECT URL HERE>>"
  loggingEnabled=true>Login</button>
```
NOTE: The auth-button webcomponent also support **domainHint** and **loginHint** as attributes.  Add in these attributes if needed.

B2C_NOTE: See [https://docs.microsoft.com/en-us/azure/active-directory-b2c/b2clogin](https://docs.microsoft.com/en-us/azure/active-directory-b2c/b2clogin) for help with the resource attribute.  Don't use login.microsoftonline.com for b2c.

To test locally on Linux with an HTTP server:

```
python -m SimpleHTTPServer 4200
```

To exercise the login button, open your browser (I use Google Chrome) and go to:  http://localhost:4200/


Enjoy,

Visualjeff
