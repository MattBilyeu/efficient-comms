import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

interface advanceEscalationObject {
  escalationId: string,
  note: string,
  files: FileList
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // Login/Logout Related
  login(loginData: {email: string, password: string}) {
    return this.http.post('/login/login', loginData);
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
  createEscalation(title: string, note: string, files: FileList, teamId: string, ownerId: string, ownerName: string, stage: string) {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    };
    formData.append('title', title);
    formData.append('notes', note);
    formData.append('teamId', teamId);
    formData.append('ownerId', ownerId);
    formData.append('ownerName', ownerName);
    formData.append('stage', stage)
    return this.http.post('/escalation/createEscalation', formData)
  }

  advanceEscalation(advanceObject: advanceEscalationObject) {
    const formData = new FormData();
    if (advanceObject.files) {
      for (let i = 0; i < advanceObject.files.length; i++) {
        formData.append('files', advanceObject.files[i], advanceObject.files[i].name);
      }
    };
    formData.append('note', advanceObject.note);
    formData.append('escalationId', advanceObject.escalationId);
    return this.http.post('/escalation/advanceEscalation', formData);
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
  createUpdate(files: FileList, title: string, text: string) {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    };
    formData.append('title', title);
    formData.append('text', text);
    return this.http.post('/update/createUpdate', formData);
  }

  updateUpdate(id: string, files: FileList, title: string, text: string) {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    };
    formData.append('updateId', id);
    formData.append('title', title);
    formData.append('text', text);
    return this.http.post('/update/updateUpdate', formData)
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

  updateUser(userId: string, name: string, email: string, peerReviewer: boolean, role: string) {
    const updateData = {
      userId: userId,
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
}
