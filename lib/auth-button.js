window.app = {};

  class AuthButton extends HTMLButtonElement {
    constructor() {
      super();
      window.addEventListener('load', afterLoad);
    }

    connectedCallback() {
      const loggingEnabled = this.getAttribute('loggingEnabled') || false;

      const apiMap = new Map();
      apiMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  
      const loggerCallback = (logLevel, message, containsPii) => {
          console.log(message);
      }

      //Hack because MSAL logging is broken in v1.0.0.
      const singleMessage = (message) => {
          loggerCallback(Msal.LogLevel.Verbose, message);
      }

      /* new 1.0.0 config object.  See https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications */	    
      const msalConfig = {
          auth: {
              clientId: this.getAttribute('clientId'),
	      authority: this.getAttribute('resource'),
              validateAuthority: true, //Set to false for B2C
              redirectUri: this.getAttribute('redirectUri') //Optional.  url encoded.  Defaults to window.location.href
          },
	  system: {
            logger: {
                localCallback: loggerCallback,
                level: Msal.LogLevel.Verbose,
                logMessage: loggerCallback,
                executeCallback: loggerCallback,
                errorPii: singleMessage,
                error: singleMessage,
                warning: singleMessage,
                warningPii: singleMessage,
                info: singleMessage,
                infoPii: singleMessage,
                verbose: singleMessage,
                verbosePii: singleMessage
	    }
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

