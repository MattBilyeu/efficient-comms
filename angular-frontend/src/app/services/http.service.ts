import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Escalation } from '../models/escalation.model';
import { User } from '../models/user.model';

interface advanceEscalationObject {
  escalationId: string,
  note: string,
  files?: File[]
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // Login/Logout Related
  login(loginData: {email: string, password: string}) {
    return this.http.post('auth/login', loginData);
  }

  logout() {
    return this.http.post('/login/logout', {});
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

  getUserNames(idArray: string[]) { 
    return this.http.post('/user/getUserNames', {userIds: idArray}) // Used when loading manager module
  }

  // Escalation related
  createEscalation(e: Escalation) {
    return this.http.post('/escalation/createEscalation', e)
  }

  advanceEscalationo(advanceObject: advanceEscalationObject) {
    return this.http.post('/escalation/advanceEscalation', advanceObject)
  }

  deleteEscalation(id: string) {
    return this.http.post('/escalation/deleteEscalation', {escalationId: id})
  }

  // Team related
  createTeam(name: string) {
    return this.http.post('/team/createTeam', {name: name})
  }

  updateTeamName(name: string, id: string) {
    return this.http.post('/team/updateTeamName', {name: name, teamId: id})
  }

  reassignMembers(targetTeamId: string, oldTeamId: string, userId: string) {
    return this.http.post('/team/reassignMembers', {teamId: targetTeamId, oldTeamId: oldTeamId, userId: userId})
  }

  deleteTeam(id: string) {
    return this.http.post('/team/deleteTeam', {teamId: id})
  }

  getPopulatedTeam(id: string) {
    return this.http.post('/team/getPopulatedTeam', {teamId: id});
  }

  // Update related
  createUpdate(files: File[], title: string, text: string) {
    return this.http.post('/update/createUpdate', {files: files, title: title, text: text})
  }

  updateUpdate(id: string, files: File[], title: string, text: string) {
    return this.http.post('/update/updateUpdate', {updateId: id, files: files, title: title, text: text})
  }

  acknowledgeUpdate(id: string) {
    return this.http.post('/update/acknowledgeUpdate', {updateId: id})
  }

  deleteUpdate(id: string) {
    return this.http.post('/update/deleteUpdate', {updateId: id})
  }

  // User related
  createUser(user: User) {
    return this.http.post('/user/createUser', user)
  }

  updateuser(name: string, email: string, peerReviewer: boolean, role: string) {
    const updateData = {
      name: name,
      email: email,
      peerReviewer: peerReviewer,
      role: role
    };
    return this.http.post('/user/updateUser', updateData)
  }

  deleteUser(id: string) {
    return this.http.post('/user/deleteUser', {userId: id})
  }

  // --> Leaving off findUserById - may not be necessary
}
