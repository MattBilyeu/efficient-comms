import { Component, EventEmitter, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { Update } from 'src/app/models/update.model';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css']
})
export class UpdatesComponent implements OnInit {
  alert: string;
  updates: Update[];

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.updates = this.dataService.team.updates.filter(update => {
      const foundIndex = update.notAcknowledged.findIndex((Id)=> {
        return this.dataService.user._id === Id
      });
      return foundIndex !== -1
    })
  };

  updateComponent() {
    this.httpService.getPopulatedTeam(this.dataService.user.teamId)
      .subscribe((team: Team) => {
        this.dataService.team = team;
        this.updates = this.dataService.team.updates.filter(update => {
          const foundIndex = update.notAcknowledged.findIndex((Id)=> {
            return this.dataService.user._id === Id
          });
          return foundIndex !== -1
        })
      })
  }
}
