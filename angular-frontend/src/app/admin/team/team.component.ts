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
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  alert: string;
  users: User[] = [];
  teams: Team[];
  deleteActive: boolean = false;

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.teams = this.dataService.adminTeamOb;
    this.dataService.adminTeamOb.forEach(team => {
      this.users = this.users.concat(team.users);
    })
  }

  updateComponent() {
    this.httpService.getAllTeams().subscribe((response: Team[] | Response) => {
      if ('message' in response) {
        this.alert = response.message;
      } else {
        this.dataService.adminTeamOb = response;
        this.alert = undefined;
      };
      this.teams = this.dataService.adminTeamOb;
      this.dataService.adminTeamOb.forEach(team => {
        this.users = this.users.concat(team.users);
      })
    });
  }

  createTeam(form: NgForm) {
    this.httpService.createTeam(form.value.name)
      .subscribe((result: Response) => {
        this.updateComponent();
        this.alert = result.message;
      })
  }

  updateTeamName(form: NgForm) {
    this.httpService.updateTeamName(form.value.newName, form.value.teamId)
  }

  reassignMembers(form: NgForm) {
    const targetTeamId = form.value.teamId;
    const userId = form.value.userId;
    const oldTeamId = this.users.filter(user => user._id === userId).map(user => user.teamId)[0];
    this.httpService.reassignMembers(targetTeamId, oldTeamId, userId)
      .subscribe((result: Response) => {
        this.updateComponent();
        this.alert = result.message;
      })
  }

  activateDelete() {
    this.deleteActive = true;
  }

  deleteTeam(form: NgForm) {
    const confirmation = confirm('Are you sure you want to delete this team?  This is a destructive and irreversable action.');
    if (confirmation) {
      this.httpService.deleteTeam(form.value.teamId)
        .subscribe((result: Response) => {
          this.updateComponent();
          this.alert = result.message;
        })
    }
  }
}
