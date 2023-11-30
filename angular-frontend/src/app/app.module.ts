import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EscalationsComponent } from './escalations/escalations.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { EscalationDetailComponent } from './escalations/escalation-detail/escalation-detail.component';
import { AllUpdatesComponent } from './all-updates/all-updates.component';
import { UpdateDetailComponent } from './all-updates/update-detail/update-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EscalationsComponent,
    PassResetComponent,
    EscalationDetailComponent,
    AllUpdatesComponent,
    UpdateDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    EditorModule
  ],
  providers: [{provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
