import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = authState(this.auth);

  constructor(private auth: Auth) {}

  public login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  public signUp(name: string, email: string, password: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: name }))
    );
  }

  public logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
