import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { loginRequest } from './auth-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  user: any = null;
  apiResult: any = [];
  constructor(
    private authService: MsalService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.user = this.authService.instance.getActiveAccount();
  }
  // Authentication code -Exchangecode for token -Access token(user access) - ID token(user)
  login() {
    this.authService.loginRedirect(loginRequest);
  }
  logout() {
    this.authService.logoutRedirect();
  }
  callApi() {
  const account = this.authService.instance.getActiveAccount();
  this.authService.instance.acquireTokenSilent({
    scopes: ['api://bc16f44b-4ec9-47d7-a3a7-26e6026e9eaf/Api.Read'],
    account: account!
  })
  .then(result => {
    this.http.get<string[]>(
      'https://localhost:7019/api/values',
      {
        headers: {
          Authorization: `Bearer ${result.accessToken}`
        }
      }
    )
    .subscribe({
      next: (res) => {
        console.log('API RESPONSE:', res);
        this.apiResult = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
}
}