import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { msalInstance } from './auth-config';

export function MSALInstanceFactory() {
  return msalInstance;
}

export function msalInitializer(msalService: MsalService) {
  return () =>
    msalService.instance.initialize()
      .then(() => msalService.instance.handleRedirectPromise())
      .then(() => {
        const accounts = msalService.instance.getAllAccounts();

        if (accounts.length > 0) {
          msalService.instance.setActiveAccount(accounts[0]);
        }
      });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },

    MsalService,

    {
      provide: APP_INITIALIZER,
      useFactory: msalInitializer,
      deps: [MsalService],
      multi: true
    }
  ]
};