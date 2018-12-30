window.app = {};

  class AuthButton extends HTMLButtonElement {
    constructor() {
      super();
      window.addEventListener('load', afterLoad);
    }

    connectedCallback() {
      const clientId = this.getAttribute('clientId');
      const resource = this.getAttribute('resource');
      const redirectUri = this.getAttribute('redirectUri');
      const loggingEnabled = this.getAttribute('loggingEnabled') || false;
      const logger = loggingEnabled === true ? new Msal.Logger(function(logLevel, message, /* piiLoggingEnabled */) { console.log(message); }, { level: Msal.LogLevel.Verbose }) : undefined;
      window.app.userAgentApplication = new Msal.UserAgentApplication(
        clientId, 
        resource, 
        (errorDesc, token, error, tokenType) => {
          if (err) {
            console.log(error);
          }
        }, 
        {
          redirectUri,
          logger
        });
     
        const userAgentApplication = window.app.userAgentApplication;
        const user = userAgentApplication.getUser();
        if (!user) {
          this.addEventListener('click', e => {
            let extraParameters = "";
            if (this.hasAttribute('loginHint')) {
              extraParameters += `&login_hint=${this.getAttribute('loginHint')}`;
            }
            if (this.hasAttribute('domainHint')) {
              extraParameters += `&domain_hint=${this.getAttribute('domainHint')}`;
            }
            userAgentApplication.loginRedirect(null, extraParameters);
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
    const user = userAgentApplication.getUser();
    if (user) {
      document.querySelector('#auth-button').innerHTML = "Logout";
    }
  };
  
  window.customElements.define('auth-button', AuthButton, {extends: 'button'});

