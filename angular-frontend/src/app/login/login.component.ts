import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  error: string;
  subscription: Subscription;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.subscription = this.loginService.error.subscribe((error) => {
      this.error = error
    })
  }

  login(form: NgForm) {
    this.loginService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
