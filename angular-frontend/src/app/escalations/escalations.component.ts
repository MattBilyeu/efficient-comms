import { Component, OnInit } from '@angular/core';
import { Escalation } from '../models/escalation.model';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { Team } from '../models/team.model';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  editorConfig = {
    base_url: "/tinymce",
    suffix: ".min",
    plugins: "lists link table",
    toolbar: "numlist bullist link table"
  }

  constructor(private dataService: DataService,
              private httpService: HttpService,
              public domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.escalations = this.dataService.team.escalations.filter(escalation => escalation.ownerId === this.dataService.user.id);
    this.sanitizeNotes();
  }

  updateComponent() {
    this.httpService.getPopulatedTeam(this.dataService.user.teamId)
      .subscribe((response: Team | Response) => {
        if ('message' in response) {
          this.alert = response.message;
        } else {
          this.dataService.team = response;
          this.escalations = response.escalations.filter(escalation => escalation.ownerId === this.dataService.user.id);
          this.sanitizeNotes();
        }
      })
  };

  sanitizeNotes() {
    this.escalations = this.escalations.map(e => {
      const sanitizedNotes: SafeHtml[] = e.notes.map(note => {
        return this.domSanitizer.bypassSecurityTrustHtml(note);
      });
      return {...e, notes: sanitizedNotes}
    })
  }

  createEscalation(form: NgForm) {
    const newEscalation = new Escalation(
      form.value.title,
      [form.value.note],
      form.value.files,
      this.dataService.user.teamId,
      this.dataService.user.id,
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

  advanceEscalation(form: NgForm) {
    let advanceEscalationObject = {
      escalationId: form.value.escalationId,
      note: form.value.note,
      files: form.value.files
    }
    this.httpService.advanceEscalationo(advanceEscalationObject)
      .subscribe((response: Response) => {
        this.alert = response.message;
        if (response.message === 'Escalation advanced.') {
          this.updateComponent();
        }
      })
  }

  deleteEscalation(form: NgForm) {
    const confirmation = prompt('Are you sure you want to resolve this escalation?  It will permanently remove it.');
    if (confirmation) {
      this.httpService.deleteEscalation(form.value.escalationId)
        .subscribe((response: Response) => {
          this.alert = response.message;
          if (response.message === 'Escalation removed.') {
            this.updateComponent();
          }
        })
    }
  }
}
