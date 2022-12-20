import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private fb: NonNullableFormBuilder
  ) {}

  public get email(): AbstractControl<string | null, string | null> | null {
    return this.loginForm.get('email');
  }

  public get password(): AbstractControl<string | null, string | null> | null {
    return this.loginForm.get('password');
  }

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
