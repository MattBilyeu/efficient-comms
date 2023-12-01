import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationsComponent } from '../escalations/escalations.component';
import { EscalationDetailComponent } from '../escalations/escalation-detail/escalation-detail.component';
import { FormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';



@NgModule({
  declarations: [
    EscalationsComponent,
    EscalationDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EditorModule
  ],
  exports: [
    EscalationsComponent,
    EscalationDetailComponent
  ],
  providers: [{provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}],
})
export class SharedModule { }
