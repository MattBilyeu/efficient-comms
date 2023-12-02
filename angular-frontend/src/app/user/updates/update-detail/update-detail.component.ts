import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Team } from 'src/app/models/team.model';
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
  alert: string;
  @Input('updateId') updateId: string;
  acknowledged: EventEmitter<boolean> = new EventEmitter<boolean>();
  update: Update;
  fileUrls: string[];
  sanitizedText: SafeHtml;

  constructor(private httpService: HttpService,
              private dataService: DataService,
              private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.update = this.dataService.team.updates.filter(update => update._id === this.updateId)[0];
    if (Array.isArray(this.update.files) && typeof this.update.files[0] === 'string') {
      this.fileUrls = this.update.files
    };
    this.sanitizedText = this.domSanitizer.bypassSecurityTrustHtml(this.update.text);
  }

  acknowledgeUpdate() {
    this.httpService.acknowledgeUpdate(this.updateId)
      .subscribe((result: Response) => {
        this.alert = result.message;
        if (result.message === 'Update acknowledged.') {
          this.httpService.getPopulatedTeam(this.dataService.user.teamId)
            .subscribe((result: Team) => {
              this.dataService.team = result;
              this.acknowledged.emit(true);
            })
        }
      })
  }
}
