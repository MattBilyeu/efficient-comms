import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Update } from 'src/app/models/update.model';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-update-detail',
  templateUrl: './update-detail.component.html',
  styleUrls: ['./update-detail.component.css']
})
export class UpdateDetailComponent implements OnInit {
  @Output() updated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('uId') uId: string;
  @ViewChild('files') fileInput!: ElementRef;
  update: Update;
  fileUrls: string[] = [];
  fileList: FileList;
  text: SafeHtml;
  editorConfig = {
    base_url: "/tinymce",
    suffix: ".min",
    plugins: "lists link table",
    toolbar: "numlist bullist link table"
  };
  editText: boolean = false;

  constructor(private dataService: DataService,
    private domSanitizer: DomSanitizer,
    private httpService: HttpService) {}

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.update = this.dataService.team.updates.filter(u => u._id === this.uId)[0];
    this.text = this.domSanitizer.bypassSecurityTrustHtml(this.update.text);
    if (Array.isArray(this.update.files) && typeof this.update.files[0] === 'string') {
      this.fileUrls = this.update.files
    };
    this.httpService.getUserNames(this.update.acknowledged)
      .subscribe((result: Array<string>) => {
        this.update.acknowledged = result;
      });
    this.httpService.getUserNames(this.update.notAcknowledged)
      .subscribe((result: Array<string>) => {
        this.update.notAcknowledged = result;
      })
  }

  toggleEditText() {
    this.editText = !this.editText;
  }

  chooseFiles(event: any) {
    this.fileList = event.target.files;
  }

  updateUpdate(form: NgForm) {
    let files;
    if (this.fileList) {
      files = this.fileList;
    } else {
      files = this.fileUrls;
    }
    this.httpService.updateUpdate(
      this.uId,
      this.fileList,
      form.value.title,
      form.value.text
    ).subscribe((response: Response) => {
      this.dataService.message.next(response.message);
      if (response.message === 'Update updated.') {
        this.updated.emit(true);
        form.reset();
        this.initializeComponent();
      }
    })
  }

  deleteUpdate() {
    this.httpService.deleteUpdate(this.uId)
      .subscribe((response: Response) => {
        this.dataService.message.next(response.message);
        if (response.message === 'Update deleted.') {
          this.updated.emit(true)
        }
      })
  }
}
