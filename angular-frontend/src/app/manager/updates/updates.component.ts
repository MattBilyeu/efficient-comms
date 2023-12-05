import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  }

  updateComponent() {
    this.httpService.getPopulatedTeam(this.dataService.team._id)
  }

  chooseFiles(event: any) {
    this.files = event.target.files
  }

  createUpdate(form: NgForm) {
    console.log(form.value);
    this.httpService.createUpdate(this.files, form.value.title, form.value.text)
      .subscribe((result: Response) => {
        this.alert = result.message;
        if (result.message === 'Update created.') {
          this.updateComponent()
        }
      })
  }
}
