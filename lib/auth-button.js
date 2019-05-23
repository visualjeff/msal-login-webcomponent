window.app = {};

  class AuthButton extends HTMLButtonElement {
    constructor() {
      super();
      window.addEventListener('load', afterLoad);
    }

    connectedCallback() {
      //const clientId = this.getAttribute('clientId');
      //const resource = this.getAttribute('resource');
      //const redirectUri = this.getAttribute('redirectUri');
      const loggingEnabled = this.getAttribute('loggingEnabled') || false;
      //const logger = loggingEnabled === true ? new Msal.Logger(function(logLevel, message, /* piiLoggingEnabled */) { console.log(message); }, { level: Msal.LogLevel.Verbose }) : undefined;

      /* new 1.0.0 config object */	    
      const msalConfig = {
          auth: {
              clientId: this.getAttribute('clientId'),
	      authority: this.getAttribute('resource'),
              validateAuthority: true, //Set to false for B2C
              redirectUri: this.getAttribute('redirectUri'), //Optional.  url encoded.  Defaults to window.location.href
              postLogoutRedirectUri: 'http://localhost:4200', //Optional.  Defaults to redirectUri
              navigateToLoginRequestUrl: false //Optional.  Default is true.  
          },
	  cache: {
	      cacheLocation: 'sessionStorage', //Default is sessionStorage.  Could also be localStorage.  Default is more secure.
              storeAuthStateInCookie: false //Enable to prevent login loop that is experienced in Microsoft browsers
	  },
	  system: {
              logger: loggingEnabled === true ? new Msal.Logger(function(logLevel, message, /* piiLoggingEnabled */) { console.log(message); }, { level: Msal.LogLevel.Verbose }) : undefined, //Optional.  Should be a logger object.
              loadFrameTimeout: 6000, //Optional. Milliseconds. Inactivity before token renewal response considered timed out. Default is 6 seconds
              tokenRenewalOffsetSeconds: 300 //Optional.  Milliseconds. Window of offset needed to renew the token before expiry. Default is 300 milliseconds.
          },
	  framework: {
              isAngular: false,
              unprotectedResources: null, //Optional. Array of URIs that are unprotected resources. MSAL will not attach a token to outgoing requests that have these URI. Defaults to null.
              protectedResourceMap: null //Optional. This is mapping of resources to scopes used by MSAL for automatically attaching access tokens in web API calls. A single access token is obtained for the resource. So you can map a specific resource path as follows: {"https://graph.microsoft.com/v1.0/me", ["user.read"]}, or the app URL of the resource as: {"https://graph.microsoft.com/", ["user.read", "mail.send"]}. This is required for CORS calls. Defaults to null.
          }
      };

      window.app.userAgentApplication = new Msal.UserAgentApplication(msalConfig);
      window.app.handleRedirectCallback((error, response) => {
          console.log('response: ', response);
	  if (error) {
            console.log('error', error);
          }
      });


        const userAgentApplication = window.app.userAgentApplication;
        //const user = userAgentApplication.getUser();
        const user = userAgentApplication.getAccount();
	if (!user) {
          this.addEventListener('click', e => {
            let extraParameters = "";
            if (this.hasAttribute('loginHint')) {
              extraParameters += `&login_hint=${this.getAttribute('loginHint')}`;
            }
            if (this.hasAttribute('domainHint')) {
              extraParameters += `&domain_hint=${this.getAttribute('domainHint')}`;
            }
            //userAgentApplication.loginRedirect(null, extraParameters);
            userAgentApplication.loginRedirect({ scopes: ['user.read']});
          });
        } else {
          this.addEventListener('click', e => {
            userAgentApplication.logout();
          });
        }
    };
  }
   
  function afterLoad() {
    const userAgentApplication = window.app.userAgentApplication;
    //const user = userAgentApplication.getUser();
    const user = userAgentApplication.getAccount();
    if (user) {
      document.querySelector('#auth-button').innerHTML = "Logout";
    }
  };
  
  window.customElements.define('auth-button', AuthButton, {extends: 'button'});

