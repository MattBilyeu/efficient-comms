import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    TeamComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ],
  providers: []
})
export class AdminModule { }
