import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  user!: User;
  team!: Team;

  constructor() { }
}
