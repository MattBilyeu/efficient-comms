import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';
import { AllUpdatesComponent } from './all-updates/all-updates.component';

const routes: Routes = [
  {path: "", component: LoginComponent, pathMatch: "full"},
  {
    path: "admin",
    loadChildren: ()=> import("./admin/admin.module").then(m => m.AdminModule)
  },
  {
    path: "manager",
    loadChildren: ()=> import("./manager/manager.module").then(m => m.ManagerModule)
  },
  {
    path: "user",
    loadChildren: ()=> import("./user/user.module").then(m => m.UserModule)
  },
  { path: "pass-reset/:token", component: PassResetComponent },
  { path: "all-updates", component: AllUpdatesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
