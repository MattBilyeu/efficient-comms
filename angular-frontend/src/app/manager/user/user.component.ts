import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';

interface Response {
  message: string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  deleteActive: boolean = false;
  alert: string;
  users: User[];
  selectedUser: User;
  selectedUserId: string;

  constructor(private dataService: DataService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.updateComponent();
  }

  updateComponent() {
    this.users = this.dataService.team.users;
    if (this.users) {
      this.selectedUser = this.users[0]
    }
  }

  activateDelete() {
    this.deleteActive = true;
  }

  createUser(form: NgForm) {
    if (form.value.role === 'Admin' && form.value.teamId !== 'Admin') {
      this.alert = 'Admins must be assigned to the Admin team';
    } else {
      const newUser = new User(
        form.value.name,
        form.value.email,
        form.value.role,
        this.dataService.user.teamId,
        false
        );
      this.httpService.createUser(newUser)
        .subscribe((response: Response) => {
          this.alert = response.message;
          if (response.message === 'User created.') {
            this.updateComponent();
          }
        })
    }
  };

  selectUser() {
    this.selectedUser = this.users.filter(user => user._id === this.selectedUserId)[0]
  }

  updateUser(form: NgForm) {
    const name = form.value.name;
    const email = form.value.email;
    const peerReviewer = form.value.peerReviewer;
    const role = form.value.role;
    const userId = form.value.userId;
    this.httpService.updateUser(userId, name, email, peerReviewer, role)
      .subscribe((response: Response) => {
        this.alert = response.message
        if (response.message === 'User updated.') {
          this.updateComponent();
        }
      })
  };

  deleteUser(form: NgForm) {
    const confirmation = confirm('Are you sure you want to delete this user?  This is a destructive and irreversable action.');
    if (confirmation) {
      this.httpService.deleteUser(form.value.id).subscribe((response: Response) => {
        this.alert = response.message;
        if (response.message === 'User deleted.') {
          this.updateComponent();
        }
      })
    }
  };
}
