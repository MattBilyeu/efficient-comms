import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.css']
})
export class PassResetComponent implements OnInit {
  alert: string;
  token: string;

  constructor(private route: ActivatedRoute,
              private httpService: HttpService,
              private loginService: LoginService,
              private dataService: DataService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.token = params['token'];
    })
  }

  resetPassword(form: NgForm) {
    if (form.value.password !== form.value.confirmPassword) {
      this.alert = 'Passwords must match.'
    };
    const resetData = {token: this.token, password: form.value.password};
    this.httpService.resetPassword(resetData).subscribe((response: Response)=> {
      this.dataService.message.next(response.message);
      if (response.message === 'Password udpated.') {
        setTimeout(()=> {
          this.loginService.loggedIn.next(false)
        }, 2000)
      }
    })
  }
}
