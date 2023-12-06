import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
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
