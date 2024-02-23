import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/modules/landing-page/landing-page.module').then(m => m.LandingPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('src/app/modules/signup/signup.module').then(m => m.SignupModule),
  },
  {
    path: 'login',
    loadChildren: () => import('src/app/modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('src/app/modules/home-profile/home-profile.module').then(m => m.HomeProfileModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
