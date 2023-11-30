import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { UserComponent } from './user/user.component';
import { UpdatesComponent } from './updates/updates.component';
import { ManagerComponent } from './manager.component';
import { UpdateDetailComponent } from './updates/update-detail/update-detail.component';
import { FormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    UserComponent,
    UpdatesComponent,
    ManagerComponent,
    UpdateDetailComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    FormsModule,
    EditorModule
  ],
  providers: [{provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}],
  bootstrap: [ManagerComponent]
})
export class ManagerModule { }
