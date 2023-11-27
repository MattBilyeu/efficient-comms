import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { NgForm } from '@angular/forms';

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
              private router: Router,
              private httpService: HttpService) {}

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
      this.alert = response.message;
      if (response.message === 'Password udpated.') {
        setTimeout(()=> {
          this.router.navigate(['/login'])
        , 2000})
      }
    })
  }
}
