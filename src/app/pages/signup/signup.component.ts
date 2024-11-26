// signup.component.ts
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

// Spartan UI Component Imports
import { provideIcons } from '@spartan-ng/ui-icon-helm';
import {
  lucideEye,
  lucideEyeOff,
  lucideLoader
} from '@ng-icons/lucide';
import { SharedModule } from '../../shared/index.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    SharedModule,
  ],
  providers: [
    provideIcons({ lucideEye, lucideEyeOff, lucideLoader })
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  @ViewChild('signupForm') signupForm!: NgForm;
  isLoading = false;
  showPassword = false;

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      console.log('Form values:', form.value);
      this.isLoading = false;
    }, 1500);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
