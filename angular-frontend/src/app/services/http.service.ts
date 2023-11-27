import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  login(loginData: {email: string, password: string}) {
    return this.http.post('auth/login', loginData);
  }

  resetRequest(loginData: {email: string}) {
    return this.http.post('user/sendReset', loginData)
  }
  resetPassword(resetData: {token: string, password: string}) {
    return this.http.post('/user/resetPassword', resetData)
  }

  getAllTeams() {
    return this.http.post('/team/getAllTeams', {})
  }
}
