import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EscalationsComponent } from './escalations/escalations.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EscalationsComponent,
    PassResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
