customElements.define('user-info', class extends HTMLElement {
  connectedCallback() {
    const user = window.app.userAgentApplication.getUser();
    if (user) {
        this.innerHTML = `
	  <div class="mui-panel">
	  <div class="mui--text-title"><b>User Info:</b></div>      
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
                <td class="mui--align-top">name</td>
                <td style="word-wrap: break-word">${user.name}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">displaybleId</td>
                <td style="word-wrap: break-word">${user.displayableId}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">identityProvider</td>
                <td style="word-wrap: break-word">${user.identityProvider}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">userIdentifier</td>
                <td style="word-wrap: break-word">${user.userIdentifier}</td>
	      </tr>
              <tr>
                <td class="mui--align-top">idToken</td>
                <td style="word-wrap: break-word">${JSON.stringify(user.idToken)}</td>
	      </tr>
   	    <tbody>
	  </table>
	  </div>`;
    }
  };
});

