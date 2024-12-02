// login.component.ts
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { provideIcons } from '@spartan-ng/ui-icon-helm';
import {
  lucideEye,
  lucideEyeOff,
  lucideLoader,
  lucideMail,
  lucideLock
} from '@ng-icons/lucide';
import { SharedModule } from '../../../shared/index.module';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  providers: [
    provideIcons({
      lucideEye,
      lucideEyeOff,
      lucideLoader,
      lucideMail,
      lucideLock
    })
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  isLoading = false;
  showPassword = false;
  rememberMe = false;

  disneyLogoPath = window.location.origin + '/../frontend/src/app/assets/disney.png';

  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
