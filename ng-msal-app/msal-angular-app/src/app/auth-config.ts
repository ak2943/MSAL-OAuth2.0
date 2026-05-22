import { PublicClientApplication } from '@azure/msal-browser';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: '1ead0ba9-4881-4934-a765-991ecb29d390',
    authority: 'https://login.microsoftonline.com/bf65742e-d37d-46f9-bc1d-24def2b7bc1d',
    redirectUri: 'http://localhost:4200'
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
});

export const loginRequest = {
  scopes: [
    'api://bc16f44b-4ec9-47d7-a3a7-26e6026e9eaf/Api.Read'
  ]
};

