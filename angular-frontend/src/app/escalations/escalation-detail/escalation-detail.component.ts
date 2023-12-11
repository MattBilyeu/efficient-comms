import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Escalation } from 'src/app/models/escalation.model';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-escalation-detail',
  templateUrl: './escalation-detail.component.html',
  styleUrls: ['./escalation-detail.component.css']
})
export class EscalationDetailComponent implements OnInit{
  deleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  alert: string;
  @Input('eId') eId: string;
  escalation: Escalation;
  fileUrls: string[] = [];
  fileList: FileList;
  editorConfig = {
    base_url: "/tinymce",
    suffix: ".min",
    plugins: "lists link table",
    toolbar: "numlist bullist link table"
  };

  constructor(private dataService: DataService,
              private domSanitizer: DomSanitizer,
              private httpService: HttpService) {}

  ngOnInit() {
    this.escalation = this.dataService.team.escalations.filter(e => e._id === this.eId)[0];
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

    chooseFiles(event: any) {
      this.fileList = event.target.files
    }

  advanceEscalation(form: NgForm) {
    let advanceEscalationObject = {
      escalationId: this.eId,
      note: form.value.note,
      files: this.fileList
    }
    this.httpService.advanceEscalation(advanceEscalationObject)
      .subscribe((response: Response) => {
        this.alert = response.message;
      })
  }

  deleteEscalation() {
    const confirmation = confirm('Are you sure you want to resolve this escalation?  It will permanently remove it.');
    if (confirmation) {
      this.httpService.deleteEscalation(this.eId)
        .subscribe((response: Response) => {
          this.alert = response.message;
        })
    }
    this.deleted.emit(true);
  }
}
