import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loggedIn: boolean = false;

  constructor(private router: Router,
              private loginService: LoginService) {}

  ngOnInit() {
    this.router.navigate['/login'];
    this.loginService.loggedIn.subscribe(response => {
      this.loggedIn = response;
      if (!response) {
        this.router.navigate(['']);
      }
    });
    this.loginService.autoLogin();
  }
}
