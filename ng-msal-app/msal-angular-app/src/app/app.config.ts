import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import {provideHttpClient,withInterceptorsFromDi,HTTP_INTERCEPTORS} from '@angular/common/http';
import {MSAL_INSTANCE,MsalService,MsalInterceptor,MSAL_INTERCEPTOR_CONFIG} from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { msalInstance } from './auth-config';

export function MSALInstanceFactory() {
  return msalInstance;
}

// Starts MSAL internally - Handle redirects-get logged in acc- set active account
export function msalInitializer(msalService: MsalService) {
  return () =>
    msalService.instance.initialize()
        // authorization code → token request → tokens
      .then(() => msalService.instance.handleRedirectPromise())
      .then(() => {
        const accounts = msalService.instance.getAllAccounts();
        if (accounts.length > 0) {
          msalService.instance.setActiveAccount(accounts[0]);
        }
      });
}

export function MSALInterceptorConfigFactory() {

  const protectedResourceMap = new Map<string, string[]>();
  // Angular calls this API URL attach this access token scope
  protectedResourceMap.set(
    'https://localhost:7019/api/values',
    ['api://bc16f44b-4ec9-47d7-a3a7-26e6026e9eaf/Api.Read']
  );
  return {
    //User is sent to Microsoft login page & redirected back to app
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export const appConfig: ApplicationConfig = {
  providers: [

    provideHttpClient(withInterceptorsFromDi()),
    // Use this MSAL configuration instance for authentication
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },

    MsalService,
     // Checks if user is already logged in & set user as the active session
    {
      provide: APP_INITIALIZER,
      useFactory: msalInitializer,
      deps: [MsalService],
      multi: true
    },

    //it has configuration that decides which API calls should automatically get access tokens & which scopes to use
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },

    // Every HTTP request in Angular is automatically checked(API Req to backend).
    // If request matches:Gets access token & Adds it to request header & send it to Backend -Authorization: Bearer <access_token>
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ]
};