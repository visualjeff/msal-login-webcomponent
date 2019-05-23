customElements.define('extended-user-info', class extends HTMLElement {

  get title() {
    return this.getAttribute('title');
  }

  set title(val) {
    if (val) {
      this.setAttribute('title', value);
    } else {
      this.removeAttribute('title');
    }
  }

  connectedCallback() {
  const callGraphApi = function(graphAPIScopes, graphApiEndpoint, method, body, cb) {
    const user = window.app.userAgentApplication.getUser();
    if (!user) {
      // If not signed in, prompt to sign in via loginRedirect.  Redirect to the Azure Active Directory v2 Endpoint
      window.app.userAgentApplication.loginRedirect(/* graphAPIScopes */);
    } else {
      // In order to call a Graph API, an access token needs to be acquired. Acquire silently first.
      if (graphAPIScopes) {
        window.app.userAgentApplication.acquireTokenSilent(graphAPIScopes).then(function (token) {
          //After token is acquired, call the Web API, sending the acquired token
          callWebApiWithToken(graphApiEndpoint, token, method, body, cb);
        }, function (error) {
          // If the acquireTokenSilent() method fails, then acquire the token interactively via acquireTokenRedirect().
          if (error) {
            window.app.userAgentApplication.acquireTokenRedirect(graphAPIScopes);
          }
        });
      }
    }
  };

  const callWebApiWithToken = function(endpoint, token, method, body, cb) {
    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    headers.append("Content-Type", 'application/json; charset=utf-8');
    const options = {
      method: method,
      headers: headers
    };
    if ((options.method === "POST" || options.method === 'PATCH')) {
      options.body = body;
    }
    fetch(endpoint, options).then(function (response) {
      const contentType = response.headers.get("content-type");
      if ((response.status === 200 || response.status === 201) && contentType && contentType.indexOf("application/json") !== -1) {
        response.json().then(function (data) {
          const graphResults = JSON.stringify(data, null, 4);
          if (!cb) {
            //document.getElementById('graphResults').value = graphResults; //Render results in HTML
            alert(graphResults);
          } else {
            //cb(JSON.parse(graphResults)); //Callback is invoked.
            cb(graphResults);
          }
        }).catch(function (error) {
          //window.app.showError(endpoint, error);
          showError(endpoint, error);
        });
      } else if (response.status === 204) {
        document.getElementById('graphResults').value = 'Graph API returned 204 - Success!'; //Render results in HTML
      } else {
        response.json().then(function (data) {
          //window.app.showError(endpoint, data);
          showError(endpoint, data);
        }).catch(function (error) {
          //window.app.showError(endpoint, error);
          showError(endpoint, error);
        });
      }
    }).catch(function (error) {
      //window.app.showError(endpoint, error);
      showError(endpoint, error);
    });
  };

  const showError = function(endpoint, error, errorDesc) {
    let formattedError = JSON.stringify(error, null, 4);
    if (formattedError.length < 3) {
      formattedError = error;
    }
    alert(formattedError);
    //document.getElementById('graphResults').value = `An error has occurred:  \n${formattedError}`
  };


    const user = window.app.userAgentApplication.getUser();
    if (user) {
      callGraphApi(["user.read"], 'https://graph.microsoft.com/v1.0/me/', 'GET', null, (extendedInfo) => {
        extendedInfo = JSON.parse(extendedInfo);
        const title = this.title;
        this.innerHTML = `
	  <div class="mui-panel">
	  <div class="mui--text-title"><b>${title}</b></div>      
          <table class="mui-table mui-table--bordered" style="table-layout: fixed; width: 100%">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
	    </colgroup>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
	      </tr>
	    </thead>
            <tbody>
              <tr>
                <td class="mui--align-top">id</td>
                <td style="word-wrap: break-word">${extendedInfo.id}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Business Phones</td>
                <td style="word-wrap: break-word">${extendedInfo.businessPhones.length === 0 ? null : extendedInfo.businessPhones[0] }</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Display Name</td>
                <td style="word-wrap: break-word">${extendedInfo.displayName}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Given Name</td>
                <td style="word-wrap: break-word">${extendedInfo.givenName}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Job Title</td>
                <td style="word-wrap: break-word">${extendedInfo.jobTitle}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Mail</td>
                <td style="word-wrap: break-word">${extendedInfo.mail}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Mobile Phone</td>
                <td style="word-wrap: break-word">${extendedInfo.mobilePhone}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Office Location</td>
                <td style="word-wrap: break-word">${extendedInfo.officeLocation}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Preferred Language</td>
                <td style="word-wrap: break-word">${extendedInfo.preferredLanguage}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">Surname</td>
                <td style="word-wrap: break-word">${extendedInfo.surname}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">User Principal Name</td>
                <td style="word-wrap: break-word">${extendedInfo.userPrincipalName}</td>
	      </tr>
   	    <tbody>
	  </table>
	  </div>`;
        }
      );
    }
  };

});
