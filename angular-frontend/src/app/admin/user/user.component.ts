import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  deleteActive: boolean = false;
  alert: string;
  users: User[];
  teams: Team[];

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.teams = this.dataService.adminTeamOb;
    this.dataService.adminTeamOb.forEach(team => {
      this.users = this.users.concat(team.users);
    })
  };

  updateComponent() {
    this.httpService.getAllTeams().subscribe((response: Response | Team[]) => {
      if ('message' in response) {
        this.alert = response.message
      } else {
        this.dataService.adminTeamOb = response;
        this.teams = this.dataService.adminTeamOb;
        this.dataService.adminTeamOb.forEach(team => {
          this.users = this.users.concat(team.users);
        })
      }
    })
  };

  activateDelete() {
    this.deleteActive = true;
  }

  createUser(form: NgForm) {
    if (form.value.role === 'Admin' && form.value.teamId !== 'Admin') {
      this.alert = 'Admins must be assigned to the Admin team';
    } else {
      const newUser = new User(
        form.value.name,
        form.value.email,
        form.value.role,
        form.value.teamId,
        false
        );
      this.httpService.createUser(newUser)
        .subscribe((response: Response) => {
          this.alert = response.message;
          if (response.message === 'User created.') {
            this.updateComponent();
          }
        })
    }
  };

  updateUser(form: NgForm) {
    const name = form.value.name;
    const email = form.value.email;
    const peerReviewer = form.value.peerReviewer;
    const role = form.value.role;
    this.httpService.updateuser(name, email, peerReviewer, role)
      .subscribe((response: Response) => {
        this.alert = response.message
        if (response.message === 'User updated.') {
          this.updateComponent();
        }
      })
  };

  deleteUser(form: NgForm) {
    const confirmation = prompt('Are you sure you want to delete this user?  This is a destructive and irreversable action.');
    if (confirmation) {
      this.httpService.deleteUser(form.value.id).subscribe((response: Response) => {
        this.alert = response.message;
        if (response.message === 'User deleted.') {
          this.updateComponent();
        }
      })
    }
  };
}
