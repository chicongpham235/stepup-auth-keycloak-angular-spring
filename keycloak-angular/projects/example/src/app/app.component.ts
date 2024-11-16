import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { TransferService } from './transfer.service';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  public token: string;
  public donationResult: any;

  constructor(
    private readonly keycloak: KeycloakService,
    private transferService: TransferService
  ) {}

  public async ngOnInit() {
    this.isLoggedIn = this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }

  public login() {
    this.keycloak.login({
      acr: {
        values: ['normal'],
        essential: true
      }
    });
  }

  public logout() {
    this.keycloak.logout();
  }

  public stepUp() {
    this.keycloak.login({
      acr: {
        values: ['otp'],
        essential: true
      }
    });
  }
  public async transfer() {
    axios
      .delete('http://localhost:8090/user?email=foo@gmail.com', {
        headers: {
          Referer: 'http://localhost:8080',
          Authorization: `Bearer ${this.keycloak.getKeycloakInstance().token}`
        }
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        // if (error?.response?.data?.authenticationUrl) {
        //   window.open(error?.response?.data?.authenticationUrl, '_self');
        // }
      });
  }

  public async printToken() {
    this.token = JSON.stringify(
      this.keycloak.getKeycloakInstance().tokenParsed,
      null,
      2
    );
    console.log(this.keycloak.getKeycloakInstance().token);
  }
}
