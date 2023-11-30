import { Component, OnInit } from '@angular/core';
import { Update } from '../models/update.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-all-updates',
  templateUrl: './all-updates.component.html',
  styleUrls: ['./all-updates.component.css']
})
export class AllUpdatesComponent implements OnInit {
  updates: Update[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.updates = this.dataService.team.updates;
  }

}
