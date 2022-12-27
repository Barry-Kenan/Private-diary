import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

/**
 * для проверки повтора паролей
 * @returns (control: AbstractControl): ValidationErrors | null
 */
export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    }

    return null;
  };
}

/**
 * компонент регистрации
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  /**
   * форма для регистрации
   */
  public signUpForm: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.signUpForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: passwordsMatchValidator() }
    );
  }

  /**
   * для доступа к формконтролам
   * @returns form controls
   */
  public get f(): any {
    return this.signUpForm.controls;
  }

  /**
   * отправка формы
   */
  public submit(): void {
    const { name, email, password } = this.signUpForm.value;

    if (!this.signUpForm.valid || !name || !password || !email) {
      return;
    }

    this.authService
      .signUp(name, email, password)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toast.error('Некорректные учётные данные пользователя');

          return throwError(() => err);
        })
      )
      .subscribe(() => {
        this.toast.success('Успешная регистрация');
        this.router.navigate(['/home']);
      });
  }
}
