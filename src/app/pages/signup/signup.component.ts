// signup.component.ts
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../shared/index.module';
import { provideIcons } from '@spartan-ng/ui-icon-helm';
import {
  lucideEye,
  lucideEyeOff,
  lucideLoader,
  lucideMail,
  lucideLock,
  lucideCheck
} from '@ng-icons/lucide';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  providers: [
    provideIcons({
      lucideEye,
      lucideEyeOff,
      lucideLoader,
      lucideMail,
      lucideLock,
      lucideCheck
    })
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  @ViewChild('signupForm') signupForm!: NgForm;
  isLoading = false;
  showPassword = false;
  agreeToTerms = false;
  disneyLogoPath = '/images/disney.png';

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form values:', form.value);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
