import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { DataService } from './services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Efficient-Comms';
  loggedIn: boolean = false;
  subscription: Subscription;
  tabSelected: string;
  role: string;

  constructor(private router: Router,
              private loginService: LoginService,
              private dataService: DataService) {}

  ngOnInit() {
    this.router.navigate['/login'];
    this.loginService.loggedIn.subscribe(response => {
      this.loggedIn = response;
      if (!response) {
        this.router.navigate['/login'];
      } else {
        this.tabSelected = 'dash';
        this.routeUser(this.dataService.user.role);
      }
    });
    this.loginService.autoLogin();
  }

  routeUser(role: string) {
    if (role === 'Admin') {
      console.log('Admin route selected.')
      this.router.navigate(['/admin'])
    } else if (role === 'Manager') {
      this.router.navigate(['/manager'])
    } else if (role === 'Member') {
      this.router.navigate(['/user'])
    } else {
      this.logOut();
    }
  }

  logOut() {
    this.tabSelected = 'login';
    this.loginService.logout();
    this.router.navigate['/login']
  }

  selectDash() {
    this.tabSelected = 'dash';
    this.routeUser(this.dataService.user.role);
  }

  selectUpdates() {
    this.tabSelected = 'updates';
    this.router.navigate['/all-updates']
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
