import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Update } from 'src/app/models/update.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-update-detail',
  templateUrl: './update-detail.component.html',
  styleUrls: ['./update-detail.component.css']
})
export class UpdateDetailComponent implements OnInit {
  update: Update;
  @Input('updateId') updateId: string;
  sanitizedText: SafeHtml;
  fileUrls: string[];

  constructor(private dataService: DataService,
              private domSanitizer: DomSanitizer) {}
  
  ngOnInit() {
    this.update = this.dataService.team.updates.filter(update => update._id === this.updateId)[0];
    this.sanitizedText = this.domSanitizer.bypassSecurityTrustHtml(this.update.text);
    if (Array.isArray(this.update.files) && typeof this.update.files[0] === 'string') {
      this.fileUrls = this.update.files;
    }
  }
}
