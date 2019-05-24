window.app = {};

  class AuthButton extends HTMLButtonElement {
    constructor() {
      super();
      window.addEventListener('load', afterLoad);
    }

    connectedCallback() {
      const loggingEnabled = this.getAttribute('loggingEnabled') || false;
      //const logger = loggingEnabled === true ? new Msal.Logger(function(logLevel, message, /* piiLoggingEnabled */) { console.log(message); }, { level: Msal.LogLevel.Verbose }) : undefined;

      const apiMap = new Map();
      apiMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

      /* new 1.0.0 config object.  See https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications */	    
      const msalConfig = {
          auth: {
              clientId: this.getAttribute('clientId'),
	      authority: this.getAttribute('resource'),
              validateAuthority: true, //Set to false for B2C
              redirectUri: this.getAttribute('redirectUri') //Optional.  url encoded.  Defaults to window.location.href
          },
	  cache: {
	      //cacheLocation: 'sessionStorage', //Default is sessionStorage.  Could also be localStorage.  Default is more secure.
	  },
	  system: {
              //logger: loggingEnabled === true ? new Msal.Logger(function(logLevel, message, /* piiLoggingEnabled */) { console.log(message); }, { level: Msal.LogLevel.Verbose }) : undefined, //Optional.  Should be a logger object.
          },
	  framework: {
              protectedResourceMap: apiMap
          }
      };

      window.app.userAgentApplication = new Msal.UserAgentApplication(msalConfig);
      
      window.app.userAgentApplication.handleRedirectCallback((error, response) => {
          console.log('response: ', response);
	  if (error) {
            console.log('error', error);
          }
      });
      

        const userAgentApplication = window.app.userAgentApplication;
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
    const user = userAgentApplication.getAccount();
    if (user) {
      document.querySelector('#auth-button').innerHTML = "Logout";
    }
  };
  
  window.customElements.define('auth-button', AuthButton, {extends: 'button'});

