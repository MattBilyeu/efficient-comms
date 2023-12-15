import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = new Subject<string>();
  adminTeamOb!: Team[];
  user!: User;
  team!: Team;

  constructor() { }
}
