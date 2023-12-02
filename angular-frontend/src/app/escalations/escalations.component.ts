import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Escalation } from '../models/escalation.model';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { Team } from '../models/team.model';
import { NgForm } from '@angular/forms';

interface Response {
  message: string
}

@Component({
  selector: 'app-escalations',
  templateUrl: './escalations.component.html',
  styleUrls: ['./escalations.component.css']
})
export class EscalationsComponent implements OnInit {
  @ViewChild('files') fileInput!: ElementRef;
  alert: string;
  escalations: Escalation[];
  editorConfig = {
    base_url: "/tinymce",
    suffix: ".min",
    plugins: "lists link table",
    toolbar: "numlist bullist link table"
  };
  fileList: FileList;

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.escalations = this.filterEscalations(this.dataService.team.escalations);
  }

  updateComponent() {
    this.httpService.getPopulatedTeam(this.dataService.user.teamId)
      .subscribe((response: Team | Response) => {
        if ('message' in response) {
          this.alert = response.message;
        } else {
          this.dataService.team = response;
          this.escalations = this.filterEscalations(response.escalations);
        }
      })
  };

  filterEscalations(arr: Array<Escalation>) {
    let filteredEscalations: Escalation[];
    arr.forEach(e => {
      if (
        e.stage === 'Member' && e.ownerId === this.dataService.user._id ||
        e.stage === 'Peer Review' && this.dataService.user.peerReviewer ||
        e.stage === 'Manager' && this.dataService.user.role === 'Manager'
      ) {
        filteredEscalations.push(e)
      }
    })
    return filteredEscalations
  }

  chooseFiles(event: any) {
    this.fileList = event.target.files
  }

  createEscalation(form: NgForm) {
    const newEscalation = new Escalation(
      form.value.title,
      [form.value.note],
      this.fileList,
      this.dataService.user.teamId,
      this.dataService.user._id,
      this.dataService.user.name,
      ''
    );
    let peerReviewerFound = false;;
    for (let i = 0; i < this.dataService.team.users.length; i++) {
      if (this.dataService.team.users[i].peerReviewer) {
        peerReviewerFound = true
      }
    };
    if (peerReviewerFound) {
      newEscalation.stage = 'Peer Review'
    } else {
      newEscalation.stage = 'Manager'
    }
    this.httpService.createEscalation(newEscalation)
      .subscribe((response: Response) => {
        this.alert = response.message;
      })
  }
}
