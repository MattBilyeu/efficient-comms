import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { Team } from '../models/team.model';

interface ErrorResponse {
  message: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  alert: string = 'Loading';

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getAllTeams().subscribe((response: Team[] | ErrorResponse) => {
      if ('message' in response) {
        this.alert = response.message;
      } else {
        this.dataService.adminTeamOb = response;
        this.alert = undefined;
      }
    })
  }

}