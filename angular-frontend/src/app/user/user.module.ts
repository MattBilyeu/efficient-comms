import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UpdatesComponent } from './updates/updates.component';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { UpdateDetailComponent } from './updates/update-detail/update-detail.component';

@NgModule({
  declarations: [
    UpdatesComponent,
    UserComponent,
    UpdateDetailComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    EditorModule
  ],
  providers: [{provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}],
  bootstrap: [UserComponent]
})
export class UserModule { }
