import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo, AuthPipe } from '@angular/fire/auth-guard';

import { LandingComponent } from './components/landing/landing.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

const redirectToLogin = (): AuthPipe => redirectUnauthorizedTo(['login']);
const redirectToHome = (): AuthPipe => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingComponent },
  { path: 'home', component: HomeComponent, ...canActivate(redirectToLogin) },
  { path: 'login', component: LoginComponent, ...canActivate(redirectToHome) },
  { path: 'signup', component: SignupComponent, ...canActivate(redirectToHome) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
