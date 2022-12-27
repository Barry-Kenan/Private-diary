import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

/**
 * компонент логина
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  /**
   * форма для логина
   */
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private fb: NonNullableFormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * для доступа к формконтролам
   * @returns form controls
   */
  public get f(): any {
    return this.loginForm.controls;
  }

  /**
   * отправка формы
   */
  public submit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService
      .login(email as string, password as string)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toast.error('Некорректные учётные данные пользователя');

          return throwError(() => err);
        })
      )
      .subscribe(() => {
        this.toast.success('Успешная авторизация');
        this.router.navigate(['/home']);
      });
  }
}
