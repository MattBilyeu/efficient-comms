import { Component, OnInit } from '@angular/core';
import { Escalation } from '../models/escalation.model';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { Team } from '../models/team.model';

interface advanceEscalationObject {
  escalationId: string,
  note: string[],
  files: File[]
}

interface Response {
  message: string
}

@Component({
  selector: 'app-escalations',
  templateUrl: './escalations.component.html',
  styleUrls: ['./escalations.component.css']
})
export class EscalationsComponent implements OnInit {
  alert: string;
  escalations: Escalation[];
  // Need create escalation, advance escalation, and delete escalation methods

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.escalations = this.dataService.team.escalations;
  }

  updateComponent() {
    this.httpService.getPopulatedTeam(this.dataService.user.teamId)
      .subscribe((response: Team | Response) => {
        if ('message' in response) {
          this.alert = response.message;
        } else {
          this.dataService.team = response;
          this.escalations = response.escalations;
        }
      })
  }
}
