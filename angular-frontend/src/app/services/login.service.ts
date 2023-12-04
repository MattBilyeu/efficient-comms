import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { DataService } from './data.service';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

interface ErrorObject {
  message: string
}

interface loginPackage {
  team: Team,
  user: User
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn = new Subject<boolean>();
  error = new Subject<string>()

  constructor(private httpService: HttpService,
              private dataService: DataService,
              private router: Router) { }

  autoLogin() {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (loginData) {
      this.login(loginData.email, loginData.password);
    }
  }

  login(email: string, password: string) {
    const loginData = {
      email: email,
      password: password 
    };
    localStorage.setItem('loginData', JSON.stringify(loginData));
    this.httpService.login(loginData)
      .subscribe((response: loginPackage | ErrorObject) => {
        if ('message' in response) {
          this.error.next(response.message);
        } else {
          this.dataService.team = response.team;
          this.dataService.user = response.user;
          this.loggedIn.next(true);
        }
      })
  }

  logout() {
    this.httpService.logout().subscribe();
    this.dataService.team = undefined;
    this.dataService.user = undefined;
    localStorage.removeItem('loginData');
    this.loggedIn.next(false);
  }
}
