import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

/**
 * компонент с меню
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  /**
   * выход
   */
  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
