import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  clientId: 'ccb1fe2f-4209-42d8-b9d7-d89d90cd5ba5',
  authority: 'https://login.microsoftonline.com/bf65742e-d37d-46f9-bc1d-24def2b7bc1d',
  redirectUri: 'http://localhost:4200',
  apiUrl: 'https://localhost:7019/api/values',
  apiScope: 'api://24b145fd-ce21-4588-8211-01246d8f4149/api.Read'
};

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: msalConfig.clientId,
    authority: msalConfig.authority,
    redirectUri: msalConfig.redirectUri
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
});

export const loginRequest = {
  scopes: [msalConfig.apiScope]
};