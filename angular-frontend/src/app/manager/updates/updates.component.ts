import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  loading: boolean = true;
  updates: Update[];
  files: FileList;
  editorConfig = {
    base_url: "/tinymce",
    suffix: ".min",
    plugins: "lists link table",
    toolbar: "numlist bullist link table"
  };


  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.updates = this.dataService.team.updates;
    this.loading = false;
  }

  updateComponent() {
    this.loading = true;
    this.httpService.getPopulatedTeam(this.dataService.team._id)
      .subscribe((team: Team) => {
        this.dataService.team = team;
        this.updates = team.updates;
        this.loading = false;
      })
  }

  chooseFiles(event: any) {
    this.files = event.target.files
  }

  createUpdate(form: NgForm) {
    this.updates = [];
    this.httpService.createUpdate(this.files, form.value.title, form.value.text)
      .subscribe((result: Response) => {
        this.dataService.message.next(result.message);
        if (result.message === 'Update created.') {
          form.reset();
          this.updateComponent()
        }
      })
  }
}
