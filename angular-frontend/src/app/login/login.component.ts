import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs'
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  alert: string;
  subscription: Subscription;
  resetRequest: boolean = false;

  constructor(private loginService: LoginService,
              private httpService: HttpService,
              private dataService: DataService) {}

  ngOnInit() {
    this.subscription = this.loginService.error.subscribe((error) => {
      this.alert = error
    })
  }

  login(form: NgForm) {
    this.loginService.login(form.value.email, form.value.password);
  }

  switchReset() {
    this.resetRequest = !this.resetRequest;
  }

  sendReset(form: NgForm) {
    this.httpService.resetRequest({email: form.value.email})
      .subscribe((response: Response) => {
        this.dataService.message.next(response.message)
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
