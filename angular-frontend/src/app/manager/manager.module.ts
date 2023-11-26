import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { UserComponent } from './user/user.component';
import { UpdatesComponent } from './updates/updates.component';


@NgModule({
  declarations: [
    UserComponent,
    UpdatesComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
