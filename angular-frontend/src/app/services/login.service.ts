import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { DataService } from './data.service';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

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
              private data: DataService) { }

  login(email: string, password: string) {
    const loginData = {
      email: email,
      password: password 
    };

    this.httpService.login(loginData)
      .subscribe((response: loginPackage | ErrorObject) => {
        if ('message' in response) {
          this.error.next(response.message);
        } else {
          this.data.team = response.team;
          this.data.user = response.user;
          this.loggedIn.next(true);
        }
      })
  }
}
