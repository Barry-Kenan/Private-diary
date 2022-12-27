import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';

/**
 * сервис аутентификации
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * текущий пользователь
   */
  public currentUser$ = authState(this.auth);

  constructor(private auth: Auth) {}

  /**
   * вход
   * @param email эл. адрес
   * @param password пароль
   * @returns observable
   */
  public login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * регистрация
   * @param name имя
   * @param email эл. адрес
   * @param password пароль
   * @returns observable
   */
  public signUp(name: string, email: string, password: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: name }))
    );
  }

  /**
   * выход
   * @returns observable
   */
  public logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
