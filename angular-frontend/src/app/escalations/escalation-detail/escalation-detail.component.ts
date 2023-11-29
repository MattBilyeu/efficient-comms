import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Escalation } from 'src/app/models/escalation.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-escalation-detail',
  templateUrl: './escalation-detail.component.html',
  styleUrls: ['./escalation-detail.component.css']
})
export class EscalationDetailComponent implements OnInit{
  @Input('eId') eId: string;
  escalation: Escalation;
  fileUrls: string[] = [];

  constructor(private dataService: DataService,
              private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.escalation = this.dataService.team.escalations.filter(e => e.id === this.eId)[0];
    if (Array.isArray(this.escalation.files) && typeof this.escalation.files[0] === 'string') {
      this.fileUrls = this.escalation.files
    };
    this.sanitizeNotes();
  }

  sanitizeNotes() {
      const sanitizedNotes: SafeHtml[] = this.escalation.notes.map(note => {
        return this.domSanitizer.bypassSecurityTrustHtml(note);
      });
      this.escalation = {...this.escalation, notes: sanitizedNotes}
    }
}
