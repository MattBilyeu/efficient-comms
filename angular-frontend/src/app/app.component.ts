import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  mobileNavigation: boolean = false;

  constructor(private router: Router,
              private loginService: LoginService,
              private dataService: DataService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const hasReset = segments.filter(segment => segment.toString() === 'reset');
      if (hasReset.length === 0) {
        this.router.navigate['/login'];
        this.loginService.loggedIn.subscribe(response => {
          this.loggedIn = response;
          if (!response) {
            this.router.navigate(['']);
          } else {
            this.tabSelected = 'dash';
            this.role = this.dataService.user.role;
            this.routeUser(this.dataService.user.role);
          }
        });
        this.loginService.autoLogin();
      }
    })
  }

  routeUser(role: string) {
    if (role === 'Admin') {
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
    this.mobileNavigation = false;
    this.router.navigate([''])
  }

  selectDash() {
    this.tabSelected = 'dash';
    this.mobileNavigation = false;
    this.routeUser(this.dataService.user.role);
  }

  selectUpdates() {
    this.tabSelected = 'updates';
    this.mobileNavigation = false;
    this.router.navigate(['/all-updates'])
  }

  mobileNav() {
    this.mobileNavigation = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
