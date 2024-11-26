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
import { SharedModule } from '../../shared/index.module';

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
  // disneyLogoPath = './../../../app/assets/disney.png';

  disneyLogoPath = window.location.origin + '/../frontend/src/app/assets/disney.png';

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(this.isLoading);

    this.isLoading = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login form values:', form.value);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
