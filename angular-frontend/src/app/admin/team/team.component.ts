import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
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
  }

  //Admin Functions: Create Team, Update Team Name, Delete Team, Re-assign Members
}
