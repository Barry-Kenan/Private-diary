import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo, AuthPipe } from '@angular/fire/auth-guard';

import { LandingComponent } from './components/landing/landing.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NewNoteComponent } from './components/new-note/new-note.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';

const redirectToLogin = (): AuthPipe => redirectUnauthorizedTo(['login']);
const redirectToHome = (): AuthPipe => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingComponent, ...canActivate(redirectToHome) },
  { path: 'home', component: HomeComponent, ...canActivate(redirectToLogin) },
  { path: 'new', component: NewNoteComponent, ...canActivate(redirectToLogin) },
  { path: 'login', component: LoginComponent, ...canActivate(redirectToHome) },
  { path: 'signup', component: SignupComponent, ...canActivate(redirectToHome) },
  { path: 'edit/:id', component: EditNoteComponent, ...canActivate(redirectToLogin) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
