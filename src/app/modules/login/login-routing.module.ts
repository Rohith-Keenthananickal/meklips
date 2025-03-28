import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginWelcomeComponent } from './pages/login-welcome/login-welcome.component';

const routes: Routes = [
  {
    path: '',
    component : LoginComponent
  },
  {
    path: 'welcome',
    component: LoginWelcomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
