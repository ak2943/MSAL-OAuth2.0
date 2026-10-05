import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { loginRequest, msalConfig } from './auth-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  user: any = null;
  apiResult: string[] = [];
  constructor(
    private authService: MsalService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.user = this.authService.instance.getActiveAccount();
  }

  login() {
    this.authService.loginRedirect(loginRequest);
  }

  logout() {
    this.authService.logoutRedirect();
  }

  callApi() {
    const account = this.authService.instance.getActiveAccount();
    if (!account) {
      return;
    }
    this.authService.instance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account: account
    })
      .then(result => {
        this.http.get<string[]>(
          msalConfig.apiUrl,
          {
            headers: {
              Authorization: `Bearer ${result.accessToken}`
            }
          }
        )
          .subscribe({
            next: res => {
              this.apiResult = res;
            },
            error: err => {
              console.error('API Error:', err);
            }
          });
      })
      .catch(err => {
        console.error('Token Error:', err);
      });
  }
}